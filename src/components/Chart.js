import * as d3 from "d3";
import { useState } from "react";
import ChartDraw from "./ChartDraw";

const Chart = (props) => {
  //состояние конфигурации графика
  const [config, setConfig] = useState({
    xAxis: "sector", //выбранная ось ox
    yMetric: "price", //выбранная метрика oy
    calculation: "avg", //тип расчета
    chartType: "bar" //тип графика
  });
  
  //состояние отображения графика
  const [showChart, setShowChart] = useState(false);

  //обработчик формы
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    //обновляем конфигурацию из формы
    setConfig({
      xAxis: formData.get("xAxis"),
      yMetric: formData.get("yMetric"),
      calculation: formData.get("calculation"),
      chartType: formData.get("chartType")
    });
    
    setShowChart(true);
  };

  //убираем график при нажатии на кнопку "очистить"
  const handleClear = () => {
    setShowChart(false);
  };

  //подготовка данных для графика
  const prepareChartData = (data) => {
    //группируем данные по OX
    const grouped = d3.group(data, d => d[config.xAxis]);
    const chartData = [];

    //для каждой группы вычисляем метрику
    grouped.forEach((values, key) => {
      const numbers = values.map(v => v[config.yMetric]);
      let value;
      
      switch(config.calculation) {
        case "avg": 
          value = d3.mean(numbers);
          break;
        case "max":
          value = d3.max(numbers);
          break;
        case "min":
          value = d3.min(numbers);
          break;
        default:
          value = d3.mean(numbers);
      }
      
      //сохраняем данные для графика
      chartData.push({
        category: key, //категория 
        value: value, //вычисленное значение
        count: values.length //количество элементов в группе
      });
    });

    //сортировка данных
    if (["price", "capitalization", "pe", "ps"].includes(config.xAxis)) {
      //по велечине
      chartData.sort((a, b) => a.category - b.category);
    } else {
      //по алфавиту
      chartData.sort((a, b) => a.category.localeCompare(b.category));
    }

    return chartData;
  };

  //доступные метрики для оси oy (убирем что выбрано в ox)
  const availableYMetrics = ["price", "capitalization", "pe", "ps", "change"].filter(
    metric => metric !== config.xAxis
  );

  return (
    <fieldset className="visualization">
      <legend>Анализ акций</legend>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Ось X (категория):</label>
          <select 
            name="xAxis" 
            value={config.xAxis}
            onChange={(e) => setConfig({...config, xAxis: e.target.value})}
          >
            <option value="sector">Сектор</option>
            <option value="index">Индекс</option>
            <option value="price">Цена</option>
            <option value="capitalization">Капитализация</option>
            <option value="pe">P/E</option>
            <option value="ps">P/S</option>
          </select>
        </div>

        <div className="form-group">
          <label>Метрика для оси Y:</label>
          <select 
            name="yMetric" 
            value={config.yMetric}
            onChange={(e) => setConfig({...config, yMetric: e.target.value})}
          >
            {availableYMetrics.map(metric => (
              <option key={metric} value={metric}>
                {metric === "price" ? "Цена" : 
                 metric === "capitalization" ? "Капитализация" :
                 metric === "pe" ? "P/E" :
                 metric === "ps" ? "P/S" : "Изменение (%)"}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Тип расчета:</label>
          <select 
            name="calculation" 
            value={config.calculation}
            onChange={(e) => setConfig({...config, calculation: e.target.value})}
          >
            <option value="avg">Среднее</option>
            <option value="max">Максимум</option>
            <option value="min">Минимум</option>
          </select>
        </div>

        <div className="form-group">
          <label>Тип графика:</label>
          <select 
            name="chartType" 
            value={config.chartType}
            onChange={(e) => setConfig({...config, chartType: e.target.value})}
          >
            <option value="bar">Столбчатая</option>
            <option value="scatter">Точечная</option>
          </select>
        </div>

        <div className="form-group">
          <button type="submit">Построить</button>
          <button type="button" onClick={handleClear}>Очистить</button>
        </div>
      </form>

      {showChart && props.data.length > 0 && (
        <ChartDraw 
          data={prepareChartData(props.data)} 
          config={config}
        />
      )}
    </fieldset>
  );
};

export default Chart;