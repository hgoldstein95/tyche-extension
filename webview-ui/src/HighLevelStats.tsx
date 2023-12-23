import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SampleInfo } from "../../src/datatypes";
import { Drawer } from "./Drawer";
import { THEME_COLORS } from "./colors";

type HighLevelStatsProps = {
  property: string;
  dataset: SampleInfo[];
};

export const HighLevelStats = (props: HighLevelStatsProps) => {
  const unique = new Set(props.dataset.map((x) => x.item.toString())).size;

  const data = [{
    name: "unique",
    unique,
    duplicates: props.dataset.length - unique,
  }];

  const heuristicAlert = (() => {
    if (unique / props.dataset.length < 0.66) {
      return <i className="codicon codicon-alert text-warning mr-1" />;
    }
  })();

  return <div className="HighLevelStats">
    {heuristicAlert} Categorized by <code>unique</code>
    <Drawer open>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart
          width={800}
          height={100}
          layout="vertical"
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis type="number" domain={[0, props.dataset.length]} />
          <YAxis type="category" dataKey="name" hide={true} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="unique"
            stackId="a"
            fill={THEME_COLORS.success}
          />
          <Bar
            dataKey="duplicates"
            stackId="a"
            fill={THEME_COLORS.warning}
          />
        </BarChart>
      </ResponsiveContainer>
    </Drawer>
  </div>;
}
