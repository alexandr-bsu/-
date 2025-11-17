import React, { useState } from "react";
import Button from "./Button";

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#eed5bf] rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-dark-green font-medium text-xl mb-4">Создать мероприятие</h2>

                <div className="space-y-4">
                    {/* Поле названия мероприятия */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Название мероприятия
                        </label>
                        <input
                            type="text"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Введите название мероприятия"
                        />
                    </div>

                    {/* Поле даты и времени */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Дата и время
                        </label>
                        <input
                            type="datetime-local"
                            value={eventDateTime}
                            onChange={(e) => setEventDateTime(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {/* Поле описания */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Описание мероприятия
                        </label>
                        <textarea
                            value={eventDescription}
                            onChange={(e) => setEventDescription(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Введите описание мероприятия"
                        />
                    </div>

                    {/* Радиокнопки режима планирования */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Режим повтора мероприятия
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="нет"
                                    checked={planningMode === "нет"}
                                    onChange={(e) => setPlanningMode(e.target.value)}
                                    className="mr-2"
                                />
                                <span className="text-sm">нет</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="раз в неделю"
                                    checked={planningMode === "раз в неделю"}
                                    onChange={(e) => setPlanningMode(e.target.value)}
                                    className="mr-2"
                                />
                                <span className="text-sm">раз в неделю</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="раз в 2 недели"
                                    checked={planningMode === "раз в 2 недели"}
                                    onChange={(e) => setPlanningMode(e.target.value)}
                                    className="mr-2"
                                />
                                <span className="text-sm">раз в 2 недели</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="раз в 3 недели"
                                    checked={planningMode === "раз в 3 недели"}
                                    onChange={(e) => setPlanningMode(e.target.value)}
                                    className="mr-2"
                                />
                                <span className="text-sm">раз в 3 недели</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="раз в месяц"
                                    checked={planningMode === "раз в месяц"}
                                    onChange={(e) => setPlanningMode(e.target.value)}
                                    className="mr-2"
                                />
                                <span className="text-sm">раз в месяц</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Кнопки */}
                <div className="flex gap-3 mt-6">
                    <Button
                        intent="primary-transparent"
                        onClick={handleClose}
                        className="flex-1"
                    >
                        Отмена
                    </Button>
                    <Button
                        intent="primary"
                        onClick={handleSave}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                        Сохранить
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateEventPopup;