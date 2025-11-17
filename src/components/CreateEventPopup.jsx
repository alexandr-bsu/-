import React, { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import TextArea from "./TextArea";
import Radio from "./Radio";

const CreateEventPopup = ({ isOpen, onClose, onSave }) => {
    const [eventName, setEventName] = useState("");
    const [eventDateTime, setEventDateTime] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [planningMode, setPlanningMode] = useState("single");

    const handleSave = () => {
        if (!eventName.trim()) {
            alert("Пожалуйста, введите название мероприятия");
            return;
        }

        if (!eventDateTime) {
            alert("Пожалуйста, выберите дату и время");
            return;
        }

        const eventData = {
            name: eventName.trim(),
            dateTime: eventDateTime,
            description: eventDescription.trim(),
            planningMode: planningMode
        };

        onSave(eventData);

        // Очищаем форму
        setEventName("");
        setEventDateTime("");
        setEventDescription("");
        setPlanningMode("single");
    };

    const handleClose = () => {
        // Очищаем форму при закрытии
        setEventName("");
        setEventDateTime("");
        setEventDescription("");
        setPlanningMode("single");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 h-screen w-full flex justify-center items-center p-5 z-20">
            <div className="bg-[#eed5bf] rounded-lg w-full max-w-md">
                <div className="bg-[#eed5bf] p-5 border-b border-b-dark-green w-full flex justify-between items-center">
                    <h2 className="text-dark-green font-medium text-xl">Создать мероприятие</h2>
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
                        <label className="block text-sm font-medium text-dark-green mb-1">
                            Название мероприятия
                        </label>
                        <Input
                            intent="primary"
                            value={eventName}
                            onChangeFn={setEventName}
                            placeholder="Введите название мероприятия"
                            className="w-full"
                        />
                    </div>

                    {/* Поле даты и времени */}
                    <div>
                        <label className="block text-sm font-medium text-dark-green mb-1">
                            Дата и время
                        </label>
                        <Input
                            type="datetime-local"
                            intent="primary"
                            value={eventDateTime}
                            onChangeFn={setEventDateTime}
                            className="w-full"
                        />
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
                            <li>
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
                            </li>
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