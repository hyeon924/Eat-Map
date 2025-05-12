import { useState, useCallback, useMemo } from "react";
import "./App.css";

const AREA_CODE = {
  서울: 1,
  부산: 6,
  대전: 3,
  대구: 4,
};

const CATEGORY_CODE = {
  한식: "A05020100",
  중식: "A05020200",
  일식: "A05020300",
  양식: "A05020400",
};

const API_KEY =
  "hwKboOwuhveCrE%2FPzOpQq5JXiVuXVQkDddlhVPSPwa%2BNp4uM2QvIRDBXNdYa%2BJ9fqTGVPok6VBDA6tnOqVm70A%3D%3D";

function App() {
  const [region, setRegion] = useState("서울");
  const [category, setCategory] = useState("한식");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRestaurants = useCallback(async (region, category) => {
    const areaCode = AREA_CODE[region];
    const categoryCode = CATEGORY_CODE[category];

    const url = `https://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=${API_KEY}&MobileOS=ETC&MobileApp=EatMap&_type=json&contentTypeId=39&areaCode=${areaCode}&cat3=${categoryCode}`;

    try {
      setIsLoading(true);
      const response = await fetch(url);
      const json = await response.json();
      const items = json.response.body.items?.item || [];
      console.log("받아온 음식점 목록:", items);
      setResults(items);
    } catch (err) {
      console.error("API 호출 오류", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = useCallback(() => {
    fetchRestaurants(region, category);
    // console.log('선택된 지역', region);
    // console.log('선택된 종류', category);
  }, [region, category, fetchRestaurants]);

  const memoizedResults = useMemo(() => results, [results]);

  return (
    <div className="min-h-screen w-screen flex flex-col items-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-auto py-12 px-4">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-black text-center mb-12 bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent animate-gradient">
          🍽 전국 맛집 지도 서비스
        </h1>

        {/* 검색 영역 */}
        <div className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-xl border border-white/20 p-8 mb-12 transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <select
              className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-indigo-100 bg-white/80 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-gray-700 font-medium"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option>서울</option>
              <option>부산</option>
              <option>대전</option>
              <option>대구</option>
            </select>

            <select
              className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-indigo-100 bg-white/80 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-gray-700 font-medium"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>한식</option>
              <option>중식</option>
              <option>일식</option>
              <option>양식</option>
            </select>

            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "검색 중..." : "검색하기"}
            </button>
          </div>
        </div>

        {/* 검색결과 출력 */}
        <div className="w-full">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">맛집 정보를 불러오는 중...</p>
            </div>
          ) : memoizedResults.length > 0 ? (
            <div className="grid gap-6">
              {memoizedResults.map((place) => (
                <div
                  key={place.contentid}
                  className="backdrop-blur-lg bg-white/70 rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                      🍽
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-800 mb-2">
                        {place.title}
                      </h2>
                      <p className="text-gray-600">{place.addr1}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">
                검색 결과가 여기에 표시됩니다
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
