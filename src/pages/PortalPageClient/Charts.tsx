import { MainTitle } from '../../components/styledComponents/Texts';
import { ChartContainer } from '../../components/styledComponents/containers';
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	PieChart,
	Pie,
	Sector,
	ResponsiveContainer,
	Line,
	LineChart,
	Bar, 
	BarChart,
	RadialBar,
	RadialBarChart,
	Radar,
	RadarChart,
	Scatter,
	ScatterChart,
	Legend,
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis,

} from 'recharts';
import { useState,useCallback } from 'react';

interface ChartsProps { 
	data: any[];
	aspect?: number;
	color?: string;
	title?: string;
}

//Graficos 

//Pizza
const renderActiveShape = (props: any) => {
	const RADIAN = Math.PI / 180;
	const {
	  cx,
	  cy,
	  midAngle,
	  innerRadius,
	  outerRadius,
	  startAngle,
	  endAngle,
	  fill,
	  payload,
	  percent,
	  value
	} = props;
	const sin = Math.sin(-RADIAN * midAngle);
	const cos = Math.cos(-RADIAN * midAngle);
	const sx = cx + (outerRadius + 10) * cos;
	const sy = cy + (outerRadius + 10) * sin;
	const mx = cx + (outerRadius + 30) * cos;
	const my = cy + (outerRadius + 30) * sin;
	const ex = mx + (cos >= 0 ? 1 : -1) * 22;
	const ey = my;
	const textAnchor = cos >= 0 ? "start" : "end";
  
	return (
	  <g>
		<text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
		  {payload.label}
		</text>
		<Sector
		  cx={cx}
		  cy={cy}
		  innerRadius={innerRadius}
		  outerRadius={outerRadius}
		  startAngle={startAngle}
		  endAngle={endAngle}
		  fill={fill}
		/>
		<Sector
		  cx={cx}
		  cy={cy}
		  startAngle={startAngle}
		  endAngle={endAngle}
		  innerRadius={outerRadius + 6}
		  outerRadius={outerRadius + 10}
		  fill={fill}
		/>
		<path
		  d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
		  stroke={fill}
		  fill="none"
		/>
		<circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
		<text
		  x={ex + (cos >= 0 ? 1 : -1) * 12}
		  y={ey}
		  textAnchor={textAnchor}
		  fill="#333"
		>{`PV ${value}`}</text>
		<text
		  x={ex + (cos >= 0 ? 1 : -1) * 12}
		  y={ey}
		  dy={18}
		  textAnchor={textAnchor}
		  fill="#999"
		>
		  {`(Rate ${(percent * 100).toFixed(2)}%)`}
		</text>
	  </g>
	);
  };
export function PieChartComponent({ data, color, title }: ChartsProps) {
	const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

	return (
		<ChartContainer>
			<MainTitle>{title}</MainTitle> {/* Titulo do grafico */}
			<ResponsiveContainer width="100%" height="100%">
				<PieChart width={700} height={700}>
					<Pie
						dataKey="value"
						isAnimationActive={true}
						data={data}
						activeIndex={activeIndex}
       					activeShape={renderActiveShape}
						innerRadius={60}
						outerRadius={80}
						fill={color || '#8884d8'}
						onMouseEnter={onPieEnter}
						
					/>
				</PieChart>
			</ResponsiveContainer>
		</ChartContainer>
	);
}

//Area
export const AreaChartComponent = ({ aspect, data, color, title }: ChartsProps) => {
	return (
		<ChartContainer>
			<MainTitle>{title}</MainTitle>

			<ResponsiveContainer width="100%" aspect={aspect}> 
				<AreaChart width={500} height={250} data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
					<defs>
						<linearGradient id="total" x1="0" y1="0" x2="0" y2="1"> 
							<stop offset="5%" stopColor={color || '#8884d8'} stopOpacity={0.8} />
							<stop offset="95%" stopColor={color || '#8884d8'} stopOpacity={0} />
						</linearGradient>
					</defs>
					<XAxis dataKey="label" stroke="gray" />
					<YAxis />
					<CartesianGrid strokeDasharray="3 3" className="chartGrid" />
					<Tooltip />
					<Area
						type="monotone"
						dataKey="value"
						stroke={color || '#8884d8'}
						fillOpacity={1}
						fill="url(#total)"
					/>
				</AreaChart>
			</ResponsiveContainer>
		</ChartContainer>
	);
};

//Line

export const LineChartComponent = ({ aspect, data, color, title }: ChartsProps) => {
	return (
		<ChartContainer>
			<MainTitle>{title}</MainTitle>

			<ResponsiveContainer width="100%" aspect={aspect}> 
				<LineChart width={500} height={250} data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
					<XAxis dataKey="label" stroke="gray" />
					<YAxis />
					<CartesianGrid strokeDasharray="3 3" className="chartGrid" />
					<Tooltip />
					<Line type="monotone" dataKey="value" stroke={color || '#8884d8'} />
				</LineChart>
			</ResponsiveContainer>
		</ChartContainer>
	);
}

//Bar
export const BarChartComponent = ({ aspect, data, color, title }: ChartsProps) => {
	return (
		<ChartContainer>
			<MainTitle>{title}</MainTitle>

			<ResponsiveContainer width="100%" aspect={aspect}> 
				<BarChart width={500} height={250} data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
					<XAxis dataKey="label" stroke="gray" />
					<YAxis />
					<CartesianGrid strokeDasharray="3 3" className="chartGrid" />
					<Tooltip />
					<Bar dataKey="value" fill={color || '#8884d8'} />
				</BarChart>
			</ResponsiveContainer>
		</ChartContainer>
	);
}


//Scatter
export const ScatterChartComponent = ({ aspect, data, color, title }: ChartsProps) => {
	return (
		<ChartContainer>
			<MainTitle>{title}</MainTitle>

			<ResponsiveContainer width="100%" aspect={aspect}> 
				<ScatterChart width={500} height={250} data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
					<XAxis dataKey="label" stroke="gray" />
					<YAxis />
					<CartesianGrid strokeDasharray="3 3" className="chartGrid" />
					<Tooltip />
					<Scatter name="Amostra" dataKey="value" fill={color || '#8884d8'} />
				</ScatterChart>
			</ResponsiveContainer>
		</ChartContainer>
	);
}


//Radial
export const RadialChartComponent = ({ aspect, data, color, title }: ChartsProps) => {
	return (
		<ChartContainer>
			<MainTitle>{title}</MainTitle>

			<ResponsiveContainer width="100%" aspect={aspect}> 
				<RadialBarChart width={500} height={250} data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
					<RadialBar name="Valor" dataKey="value" stroke={color || '#8884d8'} fill={color || '#8884d8'} />
					<Tooltip />
				</RadialBarChart>
			</ResponsiveContainer>
		</ChartContainer>
	);
}

