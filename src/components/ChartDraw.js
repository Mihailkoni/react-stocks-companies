import * as d3 from "d3";
import { useEffect, useRef } from "react";

const ChartDraw = ({ data, config }) => {
  //ссылка на svg элемент
  const svgRef = useRef();
  
  //размеры и отступы графика
  const margin = { top: 40, right: 30, bottom: 100, left: 60 };
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  //отрисовка графика
  useEffect(() => {
    if (!data || data.length === 0) return;

    //очищаем предыдущий график
    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);
    
    svg.selectAll("*").remove();

    //создаем группу для графика с отступами
    const chart = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    //создаем шкалу для оси x
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.category)) //категории из данных
      .range([0, width]) //диапазон отображения
      .padding(0.3); //отступ между столбцами

    //создаем шкалу для оси y
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) * 1.15]) //диапазон значений
      .range([height, 0]); //диапазон отображения

    //ось x
    chart.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .style("font-size", "9px")
      .style("fill", "#262626")
      .style("font-family","Montserrat")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    //ось y
    chart.append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("font-size", "9px")
      .style("fill", "#262626")
      .style("font-family","Montserrat");

    //подпись оси x
    chart.append("text")
      .attr("transform", `translate(${width / 2},${height + margin.top + 50})`)
      .style("text-anchor", "middle")
      .text(getAxisLabel(config.xAxis))
      .style("font-size", "9px")
      .style("font-weight","bold")
      .style("fill", "#262626")
      .style("font-family","Montserrat");

    //подпись оси y
    chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "9px")
      .style("font-weight","bold")
      .style("fill", "#262626")
      .style("font-family","Montserrat")
      .text(getMetricLabel(config.yMetric));

    //отрисовка в зависимости от типа графика
    if (config.chartType === "bar") {
      //столбчатая
      chart.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.category))
        .attr("y", d => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.value))
        .attr("fill", "#b287fd");
    } 
    else if (config.chartType === "scatter") {
      //точечная
      chart.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.category) + xScale.bandwidth() / 2)
        .attr("cy", d => yScale(d.value))
        .attr("r", 8)
        .attr("fill", "#b2f142");
    }

    //подписи значений на графике
    chart.selectAll(".value-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "value-label")
      .attr("x", d => xScale(d.category) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.value) - 10)
      .attr("text-anchor", "middle")
      .text(d => formatValue(d.value, config.yMetric))
      .style("font-size", "7px")
      .style("font-weight","bold")
      .style("fill", "#6a00ff");

  }, [data, config, width, height]);

  // Функция для форматирования значений
  const formatValue = (value, metric) => {
    if (metric === "price" || metric === "capitalization") {
      return Math.round(value); // Целые числа для цены и капитализации
    }
    return value.toFixed(2); // 2 знака после запятой для остальных метрик
  };

  // Функция для получения подписи оси
  const getAxisLabel = (axis) => {
    switch(axis) {
      case "sector": return "Сектор";
      case "index": return "Индекс";
      case "price": return "Цена (руб)";
      case "capitalization": return "Капитализация (млрд руб)";
      case "pe": return "P/E";
      case "ps": return "P/S";
      default: return axis;
    }
  };

  // Функция для получения подписи метрики
  const getMetricLabel = (metric) => {
    switch(metric) {
      case "price": return "Цена (руб)";
      case "capitalization": return "Капитализация (млрд руб)";
      case "pe": return "P/E";
      case "ps": return "P/S";
      case "change": return "Изменение (%)";
      default: return metric;
    }
  };

  return <svg ref={svgRef} width={800} height={400} />;
};

export default ChartDraw;