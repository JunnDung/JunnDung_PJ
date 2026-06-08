type TopicPillsProps = {
  topics: string[];
  activeTopic?: string;
  onTopicChange?: (topic: string) => void;
};

export default function TopicPills({ topics, activeTopic, onTopicChange }: TopicPillsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {topics.map((topic) => {
        const active = topic === activeTopic;

        return (
          <button
            key={topic}
            type="button"
            onClick={() => onTopicChange?.(topic)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 ${
              active
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900"
            }`}
          >
            {topic}
          </button>
        );
      })}
    </div>
  );
}
