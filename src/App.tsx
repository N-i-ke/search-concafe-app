import React, { useState } from "react";
import axios from "axios";

const App: React.FC = () => {
  const [region, setRegion] = useState<string>(""); // 地区を管理するステート
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 環境変数からAPIキーを取得
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  const searchEngineId = process.env.REACT_APP_CUSTOM_SEARCH_ENGINE_ID;

  // APIキーとSearch Engine IDが設定されているか確認
  if (!apiKey || !searchEngineId) {
    return <div>APIキーまたはカスタム検索エンジンIDが設定されていません。</div>;
  }

  const handleSearch = () => {
    const baseUrl = "https://www.googleapis.com/customsearch/v1";

    // クエリを「コンカフェ」とユーザーの入力した地区を組み合わせる
    const query = `コンカフェ ${region}`;

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
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        color: "#fff",
        backgroundColor: "#000",
        minHeight: "100vh",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1>❤️コンカフェを探すためだけのアプリ❤️</h1>
      <div style={{ textAlign: "center" }}>
        <label htmlFor="region">検索したい地域:</label>
        <input
          id="region"
          type="text"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="地域を入力"
          style={{ marginRight: "10px", padding: "8px", borderRadius: "4px" }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            border: "none",
            backgroundColor: "#333",
            color: "#fff",
          }}
        >
          検索
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <h2 style={{ textAlign: "center" }}>検索結果</h2>
        {results.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px",justifyContent: "center", }}>
            {results.map((item, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#222",
                  borderRadius: "8px",
                  padding: "10px",
                  maxWidth: "300px",
                  flex: "1 1 auto",
                }}
              >
                {item.pagemap?.cse_image &&
                  item.pagemap.cse_image.length > 0 && (
                    <img
                      src={item.pagemap.cse_image[0].src}
                      alt={item.title}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "150px",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    />
                  )}
                <h3 style={{ margin: "0", fontSize: "1.2em" }}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1e90ff", textDecoration: "none" }}
                  >
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
