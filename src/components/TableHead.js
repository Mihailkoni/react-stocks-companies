import TableRow from './TableRow.js';

/*
   компонент, для вывода thead таблицы
   пропсы:
      head - данные для шапки таблицы в виде массива
*/

const TableHead = (props) => {
    const russianHeaders = {
        'name': 'Название',
        'sector': 'Сектор',
        'price': 'Цена',
        'change': 'Изменение (%)',
        'index': 'Индекс',
        'capitalization': 'Капитализация',
        'pe': 'P/E',
        'ps': 'P/S'
    };

    const translatedHeaders = props.head.map(header => russianHeaders[header] || header);
    return (
        <thead>
            <tr>   
                <TableRow row={ translatedHeaders } isHead="1"/>
            </tr>
        </thead>
    )
}

export default TableHead;