import { useState, useCallback, useMemo, useEffect } from "react";
import "./App.css";

const AREA_CODE = {
  서울: 1,
  부산: 6,
  대전: 3,
  대구: 4,
};

const AREA_DATA = {
  서울: {
    종로구: 11110,
    중구: 11140,
    용산구: 11170,
    성동구: 11200,
    광진구: 11215,
    동대문구: 11230,
    중랑구: 11260,
    성북구: 11290,
    강북구: 11305,
    도봉구: 11320,
    노원구: 11350,
    은평구: 11380,
    서대문구: 11410,
    마포구: 11440,
    양천구: 11470,
    강서구: 11500,
    구로구: 11530,
    금천구: 11545,
    영등포구: 11560,
    동작구: 11590,
    관악구: 11620,
    서초구: 11650,
    강남구: 11680,
    송파구: 11710,
    강동구: 11740,
  },
  부산: {
    중구: 26110,
    서구: 26140,
    동구: 26170,
    영도구: 26200,
    부산진구: 26230,
    동래구: 26260,
    남구: 26290,
    북구: 26320,
    해운대구: 26350,
    사하구: 26380,
    금정구: 26410,
    강서구: 26440,
    연제구: 26470,
    수영구: 26500,
    사상구: 26530,
    기장군: 26710,
  },
  대전: {
    동구: 30110,
    중구: 30140,
    서구: 30170,
    유성구: 30200,
    대덕구: 30230,
  },
  대구: {
    중구: 27110,
    동구: 27140,
    서구: 27170,
    남구: 27200,
    북구: 27230,
    수성구: 27260,
    달서구: 27290,
    달성군: 27710,
  },
};

const CATEGORY_CODE = {
  한식: "A05020100",
  중식: "A05020200",
  일식: "A05020300",
  양식: "A05020400",
};

const SORT_OPTIONS = {
  인기순: (a, b) => (b.readcount || 0) - (a.readcount || 0),
  거리순: (a, b) => (a.dist || 0) - (b.dist || 0),
  이름순: (a, b) => a.title.localeCompare(b.title),
};

const API_KEY =
  "hwKboOwuhveCrE%2FPzOpQq5JXiVuXVQkDddlhVPSPwa%2BNp4uM2QvIRDBXNdYa%2BJ9fqTGVPok6VBDA6tnOqVm70A%3D%3D";

function App() {
  const [region, setRegion] = useState("서울");
  const [category, setCategory] = useState("한식");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [sortBy, setSortBy] = useState("인기순");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [district, setDistrict] = useState("");

  const fetchRestaurants = useCallback(async (region, category, district) => {
    const areaCode = AREA_CODE[region];
    const categoryCode = CATEGORY_CODE[category];

    const url = `https://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=${API_KEY}&MobileOS=ETC&MobileApp=EatMap&_type=json&contentTypeId=39&areaCode=${areaCode}&numOfRows=80`;

    try {
      setIsLoading(true);
      const response = await fetch(url);
      const json = await response.json();
      const items = json.response.body.items?.item || [];

      // 👇 구 필터링 (district가 있을 때만)
      const filteredItems = district
        ? items.filter((item) => item.addr1?.includes(district))
        : items;

      setResults(filteredItems);
    } catch (err) {
      console.error("API 호출 오류", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    fetchRestaurants(region, category, district);
  }, [region, category, district, fetchRestaurants]);

  const handleRestaurantClick = useCallback((restaurant) => {
    setSelectedRestaurant(restaurant);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedRestaurant(null);
  }, []);

  const paginatedResults = useMemo(() => {
    const sorted = [...results].sort(SORT_OPTIONS[sortBy]);
    const start = (currentPage - 1) * itemsPerPage;
    return sorted.slice(start, start + itemsPerPage);
  }, [results, sortBy, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(results.length / itemsPerPage);
  }, [results]);

  const districtOptions = useMemo(() => {
    return Object.keys(AREA_DATA[region] || {});
  }, [region]);

  useEffect(() => {
    setDistrict("");
  }, [region]);
  const images = useMemo(() => {
    const list = [];
    if (selectedRestaurant?.firstimage)
      list.push(selectedRestaurant.firstimage);
    if (selectedRestaurant?.firstimage2)
      list.push(selectedRestaurant.firstimage2);
    return list;
  }, [selectedRestaurant]);

  return (
    <div className="min-h-screen w-screen flex flex-col items-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-auto py-12 px-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="relative mb-16">
          <h1 className="text-5xl sm:text-6xl font-black text-center bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 bg-clip-text text-transparent animate-gradient-x py-4 px-8">
            <div className="flex items-center justify-center gap-4">
              <img
                src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Fork%20and%20Knife%20with%20Plate.png"
                alt="Fork and Knife with Plate"
                width="60"
                height="60"
                className="animate-bounce"
              />
              <span>맛콩이 맛집</span>
              <img
                src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Fork%20and%20Knife%20with%20Plate.png"
                alt="Fork and Knife with Plate"
                width="60"
                height="60"
                className="animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
            </div>
          </h1>
        </div>

        {/* 검색 영역 */}
        <div className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-xl border border-orange-100 p-8 mb-12">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <select
              className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-orange-100 bg-white/80 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-gray-700 font-medium cursor-pointer"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option>서울</option>
              <option>부산</option>
              <option>대전</option>
              <option>대구</option>
            </select>
            <select
              className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-orange-100 bg-white/80 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-gray-700 font-medium cursor-pointer"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              <option value="">전체(구)</option>
              {districtOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-orange-100 bg-white/80 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-gray-700 font-medium cursor-pointer"
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
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-amber-600 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? "검색 중..." : "검색하기"}
            </button>
          </div>
        </div>

        {/* 검색 결과 정보 및 정렬 옵션 */}
        {results.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <div className="text-gray-600 font-bold text-md">
              총 {results.length}개
            </div>
            {/* <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-orange-100 bg-white/80 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-gray-700 font-medium cursor-pointer"
            >
              <option value="인기순">인기순</option>
              <option value="거리순">거리순</option>
              <option value="이름순">이름순</option>
            </select> */}
          </div>
        )}

        {/* 검색결과 출력 */}
        <div className="w-full">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">맛집 정보를 불러오는 중...</p>
            </div>
          ) : paginatedResults.length > 0 ? (
            <div className="grid gap-6">
              {paginatedResults.map((place) => (
                <div
                  key={place.contentid}
                  onClick={() => handleRestaurantClick(place)}
                  className="backdrop-blur-lg bg-white/70 rounded-2xl p-6 shadow-lg border border-orange-100 hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M21.1 17.032C20.9963 17.1127 20.8777 17.1722 20.751 17.207C20.6242 17.2418 20.4919 17.2513 20.3615 17.235C20.2311 17.2187 20.1052 17.1768 19.991 17.1117C19.8768 17.0467 19.7766 16.9598 19.696 16.856L17.202 13.65C16.8761 13.2304 16.4264 12.924 15.9167 12.7743C15.4069 12.6247 14.863 12.6392 14.362 12.816L14.869 13.455L19.071 17.657C19.2532 17.8456 19.3539 18.0982 19.3517 18.3604C19.3494 18.6226 19.2442 18.8734 19.0588 19.0588C18.8734 19.2442 18.6226 19.3494 18.3604 19.3517C18.0982 19.354 17.8456 19.2532 17.657 19.071L13.455 14.869L12.815 14.362C12.6383 14.8631 12.6239 15.4071 12.7738 15.9169C12.9237 16.4266 13.2302 16.8763 13.65 17.202L16.857 19.696C17.0597 19.861 17.1898 20.0989 17.2193 20.3586C17.2488 20.6184 17.1754 20.8793 17.0148 21.0857C16.8543 21.292 16.6194 21.4272 16.3603 21.4624C16.1013 21.4976 15.8388 21.43 15.629 21.274L12.422 18.78C11.5805 18.1253 10.9966 17.1951 10.773 16.1526C10.5493 15.1102 10.7001 14.0223 11.199 13.08L4.422 7.705C4.16361 7.50033 3.95144 7.24332 3.79943 6.95084C3.64741 6.65836 3.55899 6.33703 3.53997 6.00795C3.52094 5.67887 3.57175 5.3495 3.68905 5.04145C3.80635 4.7334 3.98748 4.45365 4.22056 4.22057C4.45364 3.98748 4.73339 3.80635 5.04144 3.68905C5.34949 3.57175 5.67887 3.52095 6.00795 3.53997C6.33703 3.55899 6.65835 3.64742 6.95083 3.79943C7.24332 3.95145 7.50033 4.16361 7.705 4.422L13.08 11.199C14.0223 10.7001 15.1102 10.5493 16.1526 10.773C17.1951 10.9966 18.1253 11.5805 18.78 12.422L21.275 15.629C21.4377 15.8384 21.5105 16.1038 21.4775 16.3669C21.4445 16.63 21.3094 16.8693 21.1 17.032ZM7.951 7.952L6.138 5.665C6.10863 5.62736 6.0716 5.59639 6.02936 5.57414C5.98712 5.55189 5.94064 5.53887 5.89299 5.53594C5.84534 5.53301 5.79761 5.54024 5.75296 5.55715C5.70831 5.57405 5.66777 5.60025 5.63401 5.63401C5.60025 5.66777 5.57405 5.70831 5.55715 5.75296C5.54024 5.79761 5.53301 5.84534 5.53594 5.89299C5.53887 5.94064 5.55189 5.98712 5.57414 6.02936C5.59639 6.0716 5.62736 6.10863 5.665 6.138L7.951 7.952Z"
                          fill="#ffffff"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-800 mb-2">
                        {place.title}
                      </h2>
                      <p className="text-gray-600">{place.addr1}</p>
                      {sortBy === "인기순" && place.readcount && (
                        <p className="text-sm text-orange-600 mt-2">
                          조회수: {place.readcount.toLocaleString()}회
                        </p>
                      )}
                      {sortBy === "거리순" && place.dist && (
                        <p className="text-sm text-orange-600 mt-2">
                          거리: {place.dist}km
                        </p>
                      )}
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

          {/* 페이지네이션 */}
          {paginatedResults.length > 0 && totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg border transition cursor-pointer
                    ${
                      page === currentPage
                        ? "bg-orange-500 text-white font-bold"
                        : "bg-white text-gray-700 border-orange-200 hover:bg-orange-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* 상세 정보 모달 */}
      {selectedRestaurant && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full h-[100%] max-h-[95vh] overflow-y-auto">
            <div className="p-10">
              <div className="flex justify-between items-start mb-10">
                <h2 className="text-3xl font-bold text-gray-800">
                  {selectedRestaurant.title}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-orange-500 transition-colors cursor-pointer text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-orange-600 font-semibold w-28 text-lg">
                    주소
                  </span>
                  <div className="flex flex-row items-center justify-between flex-1">
                    <span className="text-gray-600 text-lg">
                      {selectedRestaurant.addr1 || "등록된 주소가 없습니다"}
                    </span>
                    {selectedRestaurant.addr1 && (
                      <button
                        onClick={() =>
                          window.open(
                            `https://map.kakao.com/?q=${encodeURIComponent(
                              selectedRestaurant.addr1
                            )}`,
                            "_blank"
                          )
                        }
                        className="text-sm text-orange-500 underline hover:text-orange-600 transition-colors ml-4"
                      >
                        카카오지도에서 보기
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-orange-600 font-semibold w-28 text-lg">
                    전화번호
                  </span>
                  <span className="text-gray-600 text-lg">
                    {selectedRestaurant.tel || "등록된 전화번호가 없습니다"}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-orange-600 font-semibold w-28 text-lg">
                    홈페이지
                  </span>
                  {selectedRestaurant.homepage ? (
                    <a
                      href={selectedRestaurant.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-700 hover:underline cursor-pointer text-lg"
                    >
                      {selectedRestaurant.homepage}
                    </a>
                  ) : (
                    <span className="text-gray-600 text-lg">
                      등록된 홈페이지가 없습니다
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-4">
                  <span className="text-orange-600 font-semibold w-28 text-lg">
                    소개
                  </span>
                  <p className="text-gray-600 text-lg leading-relaxed flex-1">
                    {selectedRestaurant.overview ||
                      "등록된 소개 정보가 없습니다"}
                  </p>
                </div>

                <div className="mt-8">
                  {selectedRestaurant.firstimage ? (
                    <div className="w-full max-h-[500px] overflow-hidden rounded-xl">
                      <img
                        src={selectedRestaurant.firstimage}
                        alt={selectedRestaurant.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-80 bg-gray-100 rounded-xl flex items-center justify-center">
                      <span className="text-gray-400 text-lg">
                        등록된 이미지가 없습니다
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
