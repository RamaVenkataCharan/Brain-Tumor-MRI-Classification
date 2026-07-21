import { ModelMetrics } from "@/lib/modelResults";

interface ResultsTableProps {
  models: ModelMetrics[];
  activeModel: string;
  onSelectModel: (name: string) => void;
}

export default function ResultsTable({ models, activeModel, onSelectModel }: ResultsTableProps) {
  return (
    <div className="bg-surface rounded-2xl border border-border-slate overflow-hidden">
      <div className="p-6 border-b border-border-slate">
        <h4 className="text-sm font-bold tracking-wider uppercase text-teal-accent font-heading">
          Detailed Benchmark Metrics
        </h4>
        <p className="text-xs text-text-muted mt-1">
          Detailed metrics comparison of the six transfer learning models reported in the Cancers 2025 paper.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border-slate bg-bg-deep/50 text-[10px] uppercase font-bold tracking-wider text-text-muted">
              <th className="py-4 px-6">Model Architecture</th>
              <th className="py-4 px-4 text-center">Accuracy</th>
              <th className="py-4 px-4 text-center">Train Loss</th>
              <th className="py-4 px-4 text-center">Test Loss</th>
              <th className="py-4 px-4 text-center">Macro Precision</th>
              <th className="py-4 px-4 text-center">Macro Recall</th>
              <th className="py-4 px-4 text-center">Macro F1</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-slate/50">
            {models.map((model) => {
              const isActive = model.name === activeModel;
              return (
                <tr
                  key={model.name}
                  onClick={() => onSelectModel(model.name)}
                  className={`cursor-pointer transition-colors hover:bg-surface-light/30 ${
                    isActive ? "bg-surface-light/60 font-medium text-text-primary" : "text-text-muted"
                  }`}
                >
                  <td className="py-4 px-6 font-semibold flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isActive ? "bg-teal-accent" : "bg-transparent"}`} />
                    {model.name}
                  </td>
                  <td className="py-4 px-4 text-center text-teal-accent font-bold">
                    {(model.accuracy * 100).toFixed(2)}%
                  </td>
                  <td className="py-4 px-4 text-center font-mono">
                    {model.trainLoss.toFixed(4)}
                  </td>
                  <td className="py-4 px-4 text-center font-mono">
                    {model.testLoss.toFixed(4)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {model.macroAvg.precision.toFixed(3)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {model.macroAvg.recall.toFixed(3)}
                  </td>
                  <td className="py-4 px-4 text-center font-semibold">
                    {model.macroAvg.f1Score.toFixed(3)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-bg-deep/30 text-[10px] text-text-dim text-center border-t border-border-slate/40">
        Tip: Click on a table row to view that model's confusion matrix and class breakdown details.
      </div>
    </div>
  );
}
