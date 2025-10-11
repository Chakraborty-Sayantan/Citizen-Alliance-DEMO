import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

export interface NewsArticle {
  title: string;
  source: string;
  timestamp: string;
  url: string;
}

const NewsCard = (article: NewsArticle) => {
  const timeAgo = formatDistanceToNow(new Date(article.timestamp), {
    addSuffix: true,
  });

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <Card className="p-4 hover:bg-accent transition-colors">
        <h4 className="font-semibold text-sm mb-1">{article.title}</h4>
        <p className="text-xs text-muted-foreground">
          {article.source} • {timeAgo}
        </p>
      </Card>
    </a>
  );
};

export default NewsCard;