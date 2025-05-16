import { useState } from 'react';

const Filter = (props) => {
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minCapitalization, setMinCapitalization] = useState('');
    const [maxCapitalization, setMaxCapitalization] = useState('');
    const [minPE, setMinPE] = useState('');
    const [maxPE, setMaxPE] = useState('');
    const [minPS, setMinPS] = useState('');
    const [maxPS, setMaxPS] = useState('');
    const [minChange, setMinChange] = useState('');
    const [maxChange, setMaxChange] = useState('');

    const handleSubmit = (event) => {        
        event.preventDefault();		

        const formData = new FormData(event.target);
        const filterField = {
            "name": formData.get("name").toLowerCase().trim(),
            "sector": formData.get("sector").toLowerCase().trim(),
            "index": formData.get("index").toLowerCase().trim(),
            "price": [minPrice ? parseFloat(minPrice) : -Infinity, maxPrice ? parseFloat(maxPrice) : Infinity],
            "capitalization": [minCapitalization ? parseFloat(minCapitalization) : -Infinity, maxCapitalization ? parseFloat(maxCapitalization) : Infinity],
            "pe": [minPE ? parseFloat(minPE) : -Infinity, maxPE ? parseFloat(maxPE) : Infinity],
            "ps": [minPS ? parseFloat(minPS) : -Infinity, maxPS ? parseFloat(maxPS) : Infinity],
            "change": [minChange ? parseFloat(minChange) : -Infinity, maxChange ? parseFloat(maxChange) : Infinity]
        };
            
        let arr = props.fullData;
        for(const key in filterField) {
            if (Array.isArray(filterField[key])) {
                const [min, max] = filterField[key];
                arr = arr.filter(item => {
                    const value = parseFloat(item[key]);
                    return value >= min && value <= max;
                });
            } else {
                if (filterField[key]) {
                    arr = arr.filter(item => 
                        item[key].toLowerCase().includes(filterField[key]));
                }
            }
        } 
                
        props.filtering(arr);
    }

    const handleReset = () => {
        setMinPrice('');
        setMaxPrice('');
        setMinCapitalization('');
        setMaxCapitalization('');
        setMinPE('');
        setMaxPE('');
        setMinPS('');
        setMinChange('');
        setMaxChange('');
        props.filtering(props.fullData);
        document.getElementById("filter-form").reset();
    }

    return (
        <form id="filter-form" onSubmit={handleSubmit} onReset={handleReset}>
            <fieldset className="filter">
                <legend>Фильтр</legend>
                <div className="filter-grid">
                    <div>
                        <label>Название компании:</label>
                        <input name="name" type="text" placeholder="Название"/>
                    </div>
                    <div>
                        <label>Сектор:</label>
                        <input name="sector" type="text" placeholder="Сектор"/>
                    </div>
                    <div>
                        <label>Индекс:</label>
                        <input name="index" type="text" placeholder="Индекс"/>
                    </div>
                    <div>
                        <label>Цена (руб):</label>
                        <div>
                            <input 
                                type="number" 
                                placeholder="От" 
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                            <input 
                                type="number" 
                                placeholder="До" 
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label>Капитализация (млрд руб):</label>
                        <div>
                            <input 
                                type="number" 
                                placeholder="От" 
                                value={minCapitalization}
                                onChange={(e) => setMinCapitalization(e.target.value)}
                            />
                            <input 
                                type="number" 
                                placeholder="До" 
                                value={maxCapitalization}
                                onChange={(e) => setMaxCapitalization(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label>P/E:</label>
                        <div>
                            <input 
                                type="number" 
                                placeholder="От" 
                                value={minPE}
                                onChange={(e) => setMinPE(e.target.value)}
                            />
                            <input 
                                type="number" 
                                placeholder="До" 
                                value={maxPE}
                                onChange={(e) => setMaxPE(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label>P/S:</label>
                        <div>
                            <input 
                                type="number" 
                                placeholder="От" 
                                value={minPS}
                                onChange={(e) => setMinPS(e.target.value)}
                            />
                            <input 
                                type="number" 
                                placeholder="До" 
                                value={maxPS}
                                onChange={(e) => setMaxPS(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label>Изменение (%):</label>
                        <div>
                            <input 
                                type="number" 
                                placeholder="От"
                                value={minChange}
                                onChange={(e) => setMinChange(e.target.value)} 
                            />
                            <input 
                                type="number" 
                                placeholder="До" 
                                value={maxChange}
                                onChange={(e) => setMaxChange(e.target.value)} 
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <button type="submit">Фильтровать</button>
                    <button type="reset">Очистить фильтр</button>
                </div>
            </fieldset>
        </form>
    )
}

export default Filter;