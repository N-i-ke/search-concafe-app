import React, { useState } from "react";
import axios from "axios";

const App: React.FC = () => {
  const [query, setQuery] = useState<string>("コンカフェ");
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 環境変数からAPIキーを取得
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

  // APIキーが設定されているか確認
  if (!apiKey) {
    return <div>APIキーが設定されていません。</div>;
  }

  const handleSearch = () => {
    const baseUrl = "https://www.googleapis.com/customsearch/v1";
    const searchEngineId = process.env.REACT_APP_CUSTOM_SEARCH_ENGINE_ID; // Custom Search Engine IDをここに入れます

    const url = `${baseUrl}?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(
      query
    )}`;


    axios
      .get(url)
      .then((response) => {
        console.log("APIリクエスト結果:", response.data);
        setResults(response.data.items || []);
        setError(null);
      })
      .catch((error) => {
        console.error("APIリクエストに失敗しました:", error);
        setError("APIリクエストに失敗しました。");
      });
  };

  return (
    <div>
      <h1>コンカフェ検索アプリ</h1>
      <div>
        <label htmlFor="query">検索キーワード:</label>
        <input
          id="query"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <button onClick={handleSearch}>検索</button>
      <div>
        {error && <p>{error}</p>}
        <h2>検索結果</h2>
        {results.length > 0 ? (
          <div>
            {results.map((item, index) => (
              <div
                key={index}
                style={{ marginBottom: "20px", display: "flex" }}
              >
                {item.pagemap?.cse_image &&
                  item.pagemap.cse_image.length > 0 && (
                    <img
                      src={item.pagemap.cse_image[0].src}
                      alt={item.title}
                      style={{
                        maxWidth: "200px",
                        maxHeight: "150px",
                        marginBottom: "10px",
                      }}
                    />
                  )}
                <h3>
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                </h3>
                <p>{item.snippet}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>該当する結果がありません。</p>
        )}
      </div>
    </div>
  );
};

export default App;
