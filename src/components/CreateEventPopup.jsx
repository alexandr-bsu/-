import React, { useState } from "react";
import { toast } from "sonner";
import Button from "./Button";
import { Input } from "./ui/NewInput";
import TextArea from "./TextArea";
import Radio from "./Radio";

const CreateEventPopup = ({ isOpen, onClose, onSave }) => {
    const [eventName, setEventName] = useState("");
    const [eventDateTime, setEventDateTime] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [planningMode, setPlanningMode] = useState("нет");

    const handleSave = async () => {
        // Валидация названия
        if (!eventName.trim()) {
            toast.error("Не указано название");
            return;
        }

        // Валидация даты
        if (!eventDateTime) {
            toast.error("Не задана дата мероприятия");
            return;
        }

        try {
            // Получаем secret из URL параметров
            const urlParams = new URLSearchParams(window.location.search);
            const secret = urlParams.get('secret');

            if (!secret) {
                toast.error("Отсутствует параметр secret в URL");
                return;
            }

            // Парсим дату и время
            const dateTimeObj = new Date(eventDateTime);
            const date = dateTimeObj.toISOString().split('T')[0]; // YYYY-MM-DD
            // Устанавливаем минуты в 00, часы оставляем без изменений
            const hours = dateTimeObj.getHours().toString().padStart(2, '0');
            const time = `${hours}:00`;

            // Подготавливаем данные для API
            const apiData = {
                secret: secret,
                date: date,
                time: time,
                title: eventName.trim(),
                description: eventDescription.trim() || "",
                repeat_period: planningMode === "нет" ? null : planningMode,
                event_modal_type: "пользовательское"
            };

            // Отправляем запрос на API
            const response = await fetch("https://n8n-v2.hrani.live/webhook/create-custom-event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(apiData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            // Форматируем дату в дд.мм формат
            const [year, month, day] = date.split('-');
            const formattedDate = `${day}.${month}`;

            // Показываем успешное уведомление с деталями
            toast.success(
                `Мероприятие "${eventName.trim()}" успешно создано на ${formattedDate} в ${time}!`,
                {
                    duration: 4000,
                    style: {
                        background: '#10B981',
                        color: 'white',
                    },
                }
            );

            // Передаем данные родительскому компоненту для моментального отображения
            if (onSave) {
                onSave({
                    ...result,
                    isCustomEvent: true, // Флаг для определения пользовательского мероприятия
                    event_modal_type: "пользовательское", // Модальность для определения пользовательского события
                    // Дополнительные данные для корректного отображения
                    originalTitle: eventName.trim(),
                    originalDescription: eventDescription.trim(),
                    originalDate: date,
                    originalTime: time,
                    originalRepeatPeriod: planningMode
                });
            }

            // Очищаем форму и закрываем попап
            setEventName("");
            setEventDateTime("");
            setEventDescription("");
            setPlanningMode("нет");
            onClose();

        } catch (error) {
            console.error("Ошибка при создании мероприятия:", error);
            toast.error("Ошибка при создании мероприятия. Попробуйте еще раз.");
        }
    };

    const handleClose = () => {
        // Очищаем форму при закрытии
        setEventName("");
        setEventDateTime("");
        setEventDescription("");
        setPlanningMode("нет");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 h-screen w-full flex justify-center items-center p-5 z-20 bg-[#000000] bg-opacity-20">
            <div className="bg-white rounded-[30px] w-full max-w-[660px] mx-5 max-h-[650px] overflow-y-auto">
                <div className="bg-white sticky top-0 p-5 border-b border-b-dark-green w-full flex justify-between items-center z-30">
                    <h2 className="text-dark-green font-medium text-3xl">Создать мероприятие</h2>
                    <img
                        src="static/close.png"
                        className="cursor-pointer w-5 h-5"
                        onClick={handleClose}
                        alt="Закрыть"
                    />
                </div>

                <div className="p-5 flex flex-col gap-4">
                    {/* Поле названия мероприятия */}
                    <div>
                        <p className={`font-medium text-green mb-1`}>
                            Название мероприятия
                        </p>
                        <div className={`input__text_container`}>
                            <Input
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                placeholder=" "
                                className={`input__text text-[14px] w-full h-full px-[20px] bg-[#FAFAFA] rounded-[10px] border-none`}

                            />

                        </div>
                    </div>

                    {/* Поле даты и времени */}
                    <div>
                        <p className={`font-medium text-green mb-1`}>
                            Дата и время мероприятия
                        </p>
                        <div className={`input__text_container`}>
                            <Input
                                value={eventDateTime}
                                onChange={(e) => setEventDateTime(e.target.value)}
                                type="datetime-local"
                                placeholder=" "
                                className={`input__text text-[14px] w-full h-full px-[20px] bg-[#FAFAFA] rounded-[10px] border-none`}

                            />

                        </div>
                    </div>

                    {/* Поле описания */}
                    <div>
                        <label className="block text-sm font-medium text-dark-green mb-1">
                            Описание мероприятия
                        </label>
                        <TextArea
                            intent="primary"
                            value={eventDescription}
                            onChangeFn={setEventDescription}
                            rows={3}
                            placeholder="Введите описание мероприятия"
                            className="w-full"
                        />
                    </div>

                    {/* Радиокнопки режима планирования */}
                    <div>
                        <h3 className="text-dark-green font-medium mb-3">Режим повтора мероприятия</h3>
                        <ul className="flex flex-col gap-2 p-2">
                            <li>
                                <Radio
                                    name="planningMode"
                                    intent="primary"
                                    id="planning_mode_1"
                                    value="нет"
                                    onChange={(e) => setPlanningMode(e.target.value)}
                                    checked={planningMode === "нет"}
                                >
                                    Нет
                                </Radio>
                            </li>
                            <li>
                                <Radio
                                    name="planningMode"
                                    intent="primary"
                                    id="planning_mode_2"
                                    value="раз в неделю"
                                    onChange={(e) => setPlanningMode(e.target.value)}
                                    checked={planningMode === "раз в неделю"}
                                >
                                    Раз в неделю
                                </Radio>
                            </li>
                            <li>
                                <Radio
                                    name="planningMode"
                                    intent="primary"
                                    id="planning_mode_3"
                                    value="раз в 2 недели"
                                    onChange={(e) => setPlanningMode(e.target.value)}
                                    checked={planningMode === "раз в 2 недели"}
                                >
                                    Раз в 2 недели
                                </Radio>
                            </li>
                            {/* <li>
                                <Radio
                                    name="planningMode"
                                    intent="primary"
                                    id="planning_mode_4"
                                    value="раз в 3 недели"
                                    onChange={(e) => setPlanningMode(e.target.value)}
                                    checked={planningMode === "раз в 3 недели"}
                                >
                                    Раз в 3 недели
                                </Radio>
                            </li> */}
                            <li>
                                <Radio
                                    name="planningMode"
                                    intent="primary"
                                    id="planning_mode_5"
                                    value="раз в месяц"
                                    onChange={(e) => setPlanningMode(e.target.value)}
                                    checked={planningMode === "раз в месяц"}
                                >
                                    Раз в месяц
                                </Radio>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Кнопки */}
                <div className="flex gap-3 px-5 pb-5">
                    <Button
                        intent="primary-transparent"
                        hover="primary"
                        onClick={handleClose}
                        className="flex-1"
                    >
                        Отмена
                    </Button>
                    <Button
                        intent="primary"
                        hover="primary"
                        onClick={handleSave}
                        className="flex-1"
                    >
                        Сохранить
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateEventPopup;