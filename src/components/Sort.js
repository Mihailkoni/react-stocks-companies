import { useState,useEffect } from 'react';

const Sort = ({ onSort }) => {
    //состояние для выбранных параметров сортировки
    const [sortParams, setSortParams] = useState({
        firstLevel: 'NO',
        secondLevel: 'NO',
        thirdLevel: 'NO',
        firstDesc: false,
        secondDesc: false,
        thirdDesc: false
    });

    //выключение селектов
    const [disabledSelects, setDisabledSelects] = useState({
        secondLevel: true,
        thirdLevel: true
    });

    //доступные параметры
    const [availableOptions, setAvailableOptions] = useState({
        secondLevel: [],
        thirdLevel: []
    });

    //все опции
    const allOptions = [
        { value: 'NO', label: 'Нет' },
        { value: 'name', label: 'Название' },
        { value: 'sector', label: 'Сектор' },
        { value: 'price', label: 'Цена' },
        { value: 'change', label: 'Изменение (%)' },
        { value: 'capitalization', label: 'Капитализация' },
        { value: 'pe', label: 'P/E' },
        { value: 'ps', label: 'P/S' }
    ];

    //обновляем доступные опции и блокировки
    useEffect(() => {
        //блокировка select'ов
        setDisabledSelects({
            secondLevel: sortParams.firstLevel === 'NO',
            thirdLevel: sortParams.secondLevel === 'NO' || sortParams.firstLevel === 'NO'
        });

        //доступные опции для второго уровня
        const secondLevelOptions = allOptions.filter(
            option => option.value === 'NO' || option.value !== sortParams.firstLevel
        );

        //доступные опции для третьего уровня
        const thirdLevelOptions = allOptions.filter(
            option => option.value === 'NO' || 
                     (option.value !== sortParams.firstLevel && option.value !== sortParams.secondLevel)
        );

        setAvailableOptions({
            secondLevel: secondLevelOptions,
            thirdLevel: thirdLevelOptions
        });

        //автоматический сброс зависимых уровней
        if (sortParams.firstLevel === 'NO') {
            setSortParams(prev => ({
                ...prev,
                secondLevel: 'NO',
                thirdLevel: 'NO',
                secondDesc: false,
                thirdDesc: false
            }));
        } else if (sortParams.secondLevel === 'NO') {
            setSortParams(prev => ({
                ...prev,
                thirdLevel: 'NO',
                thirdDesc: false
            }));
        } else if (sortParams.secondLevel === sortParams.firstLevel) {
            setSortParams(prev => ({
                ...prev,
                secondLevel: 'NO',
                thirdLevel: 'NO',
                secondDesc: false,
                thirdDesc: false
            }));
        } else if (sortParams.thirdLevel === sortParams.firstLevel || 
                  sortParams.thirdLevel === sortParams.secondLevel) {
            setSortParams(prev => ({
                ...prev,
                thirdLevel: 'NO',
                thirdDesc: false
            }));
        }
    }, [sortParams.firstLevel, sortParams.secondLevel, sortParams.thirdLevel]);

    //обработчик изменения выбора в select
    const handleSelectChange = (e, level) => {
        const { value } = e.target;
        setSortParams(prev => ({
            ...prev,
            [level]: value
        }));
    };

    //обработчик изменения чекбокса
    const handleCheckboxChange = (e, level) => {
        const { checked } = e.target;
        setSortParams(prev => ({
            ...prev,
            [level]: checked
        }));
    };

    const applySort = () => {
        const sortArr = [];
        
        //формируем массив параметров сортировки
        if (sortParams.firstLevel !== 'NO') {
            sortArr.push({
                column: sortParams.firstLevel,
                order: sortParams.firstDesc
            });
        }
        
        if (sortParams.secondLevel !== 'NO') {
            sortArr.push({
                column: sortParams.secondLevel,
                order: sortParams.secondDesc
            });
        }
        
        if (sortParams.thirdLevel !== 'NO') {
            sortArr.push({
                column: sortParams.thirdLevel,
                order: sortParams.thirdDesc
            });
        }
        
        //передаем в родительский компонент
        onSort(sortArr);
    };

    // Сбросить сортировку
    const resetSort = () => {
        setSortParams({
            firstLevel: 'NO',
            secondLevel: 'NO',
            thirdLevel: 'NO',
            firstDesc: false,
            secondDesc: false,
            thirdDesc: false
        });
        onSort([]); //передаем пустой массив для сброса сортировки
    };

    return (
        <fieldset className="sort">
            <legend>Сортировка</legend>
            <div className="sort-level">
                <label>Первый уровень:</label>
                <select 
                    value={sortParams.firstLevel}
                    onChange={(e) => handleSelectChange(e, 'firstLevel')}
                >
                    {allOptions.map(option => (
                        <option key={`first-${option.value}`} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <label>
                    <input 
                        type="checkbox" 
                        checked={sortParams.firstDesc}
                        onChange={(e) => handleCheckboxChange(e, 'firstDesc')}
                        disabled={sortParams.firstLevel === 'NO'}
                    />
                    по убыванию?
                </label>
            </div>

            <div className="sort-level">
                <label>Второй уровень:</label>
                <select 
                    value={sortParams.secondLevel}
                    onChange={(e) => handleSelectChange(e, 'secondLevel')}
                    disabled={disabledSelects.secondLevel}
                >
                    {availableOptions.secondLevel.map(option => (
                        <option key={`second-${option.value}`} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <label>
                    <input 
                        type="checkbox" 
                        checked={sortParams.secondDesc}
                        onChange={(e) => handleCheckboxChange(e, 'secondDesc')}
                        disabled={sortParams.secondLevel === 'NO'}
                    />
                    по убыванию?
                </label>
            </div>

            <div className="sort-level">
                <label>Третий уровень:</label>
                <select 
                    value={sortParams.thirdLevel}
                    onChange={(e) => handleSelectChange(e, 'thirdLevel')}
                    disabled={disabledSelects.thirdLevel}
                >
                    {availableOptions.thirdLevel.map(option => (
                        <option key={`third-${option.value}`} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <label>
                    <input 
                        type="checkbox" 
                        checked={sortParams.thirdDesc}
                        onChange={(e) => handleCheckboxChange(e, 'thirdDesc')}
                        disabled={sortParams.thirdLevel === 'NO'}
                    />
                    по убыванию?
                </label>
            </div>

            <div className="sort-buttons">
                <button type="button" onClick={applySort}>Применить</button>
                <button type="button" onClick={resetSort}>Сбросить</button>
            </div>
        </fieldset>
    );
};

export default Sort;