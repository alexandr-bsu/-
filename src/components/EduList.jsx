import { useSelector, useDispatch } from "react-redux";
import { addEducationItem, removeEducationItemByIndex, setDataEduList } from "../redux/slices/psy";
import { Trash2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Input from "./Input";
import Button from "./Button";

function isEmpty(value) {
    return Array.isArray(value) ? value.length === 0 : value === "";
}

function getYearRange({ minYear = 1950 } = {}) {
    let currentYear = new Date().getFullYear()
    return Array.from({ length: currentYear - minYear + 1 }, (_, i) => currentYear - i)
}

const EduList = ({ showError }) => {
    const dispatch = useDispatch();
    const education = useSelector((state) => state.psyAnketa.education);

    return (
        <>

            <div className="flex flex-col gap-4 mb-8">
                {education.map((edu, index) => {
                    return (
                        <div className="flex flex-col gap-4" key={index}>
                            <div className="flex justify-between items-center">
                                <p className="text-corp-white font-bold text-xl font-sans"></p>
                                {index != 0 && <Trash2 color="#D1D8E2" size={24} onClick={() => dispatch(removeEducationItemByIndex(index))}></Trash2>}
                            </div>

                            <div className="flex gap-2 flex-col">
                                <div className="flex gap-2 max-md:flex-wrap">
                                <Select onValueChange={(e) => dispatch(setDataEduList({ index: index, key: 'educationItemType', data: e }))} value={edu.educationItemType}>
                                    <SelectTrigger className={`grow rounded-[15px] py-3 h-full text-corp-white ${showError && isEmpty(edu.educationItemType) ? "border-red" : "border-cream"}`}>
                                        <SelectValue placeholder="Выберите подтверждающий документ" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-green text-corp-white">
                                        <SelectItem value="Диплом бакалавра">Диплом бакалавра</SelectItem>
                                        <SelectItem value="Диплом специалиста">Диплом специалиста</SelectItem>
                                        <SelectItem value="Диплом магистра">Диплом магистра</SelectItem>
                                        <SelectItem value="Диплом о профессиональной переподготовке">Диплом о профессиональной переподготовке</SelectItem>
                                        <SelectItem value="Удостоверение о повышении квалификации">Удостоверение о повышении квалификации</SelectItem>
                                        <SelectItem value="Сертификат">Сертификат</SelectItem>
                                    </SelectContent>
                                </Select>
                                
                                    <Input
                                        placeholder="Введите название учреждения"
                                        intent="cream"
                                        className={
                                            `grow md:min-w-[300px] ${showError && isEmpty(edu.educationItemTitle) ? "border-red" : ""}`
                                        }
                                        value={edu.educationItemTitle}
                                        onChangeFn={(e) => dispatch(setDataEduList({ index: index, key: 'educationItemTitle', data: e }))}
                                    ></Input>
                                    <Select onValueChange={(e) => dispatch(setDataEduList({ index: index, key: 'educationItemYear', data: e }))} value={edu.educationItemYear}>
                                        <SelectTrigger className={`md:w-[150px] max-md:grow rounded-[15px]  py-3 h-full text-corp-white ${showError && isEmpty(edu.educationItemYear) ? "border-red" : "border-cream"}`}>
                                            <SelectValue placeholder="Введите год окончания обучения" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-green text-corp-white">
                                            {getYearRange().map(year => {
                                                return <SelectItem value={year}>{year}</SelectItem>
                                            })}
                                        </SelectContent>
                                    </Select>

                                </div>
                                <Input
                                        placeholder="Введите название программы"
                                        intent="cream"
                                        className={
                                            `grow ${showError && isEmpty(edu.educationItemProgramTitle) ? "border-red" : ""}`
                                        }
                                        value={edu.educationItemProgramTitle}
                                        onChangeFn={(e) => dispatch(setDataEduList({ index: index, key: 'educationItemProgramTitle', data: e }))}
                                    ></Input>
                                
                            </div>
                        </div>
                    )
                })
                }
            </div>

            <Button
                intent={"cream"}
                hover={"primary"}
                size={'small'}
                onClick={() => dispatch(addEducationItem())}
            >
                Добавить информацию об образовании
            </Button>

        </>
    )
}

export default EduList