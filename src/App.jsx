import { useCallback, useMemo, useState } from "react";
import "./App.css";

const API_KEY = import.meta.env.VITE_SEOUL_TOURISM_API_KEY;
const API_URL =
  "https://api.odcloud.kr/api/15098046/v1/uddi:086910c1-c1eb-4a9a-98df-910ed0495f6b";

const SORT_OPTIONS = {
  이름순: (a, b) => a.title.localeCompare(b.title),
  영업시간순: (a, b) => (a.businessHours || "").localeCompare(b.businessHours || ""),
  대표메뉴순: (a, b) => (a.representativeMenu || "").localeCompare(b.representativeMenu || ""),
};

const SEOUL_AREAS = [
  "종로구", "중구", "용산구", "성동구", "광진구", "동대문구", "중랑구", "성북구",
  "강북구", "도봉구", "노원구", "은평구", "서대문구", "마포구", "양천구", "강서구",
  "구로구", "금천구", "영등포구", "동작구", "관악구", "서초구", "강남구", "송파구", "강동구",
].sort((a, b) => a.localeCompare(b, "ko"));

const FACILITY_FILTERS = [
  ["parking", "주차 가능"],
  ["delivery", "배달 가능"],
  ["wifi", "와이파이"],
  ["playroom", "놀이방"],
  ["multilingualMenu", "다국어 메뉴"],
  ["smartOrder", "스마트오더"],
];

const availability = (value, yes = "가능", no = "불가") =>
  value === "Y" ? `✅ ${yes}` : value === "N" ? `🚫 ${no}` : "🙈 미제공";

const displayValue = (value) => value || "🙈 미제공";

function App() {
  const [areaFilter, setAreaFilter] = useState("");
  const [isAreaMenuOpen, setIsAreaMenuOpen] = useState(false);
  const [facilityFilters, setFacilityFilters] = useState({});
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [sortBy, setSortBy] = useState("이름순");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const fetchRestaurants = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      if (!API_KEY) throw new Error("API 키가 설정되지 않았습니다.");

      const params = new URLSearchParams({
        serviceKey: API_KEY,
        page: "1",
        perPage: "1000",
      });
      const response = await fetch(`${API_URL}?${params}`);
      if (!response.ok) throw new Error("식당 정보를 불러오지 못했습니다.");

      const json = await response.json();
      const restaurants = (json.data || [])
        .map((item) => ({
          id: item["식당(ID)"],
          title: item["식당명"],
          area: item["지역명"] || "서울특별시",
          status: item["식당상태"],
          businessHours: item["영업시간내용"],
          closedDays: item["휴무일정보내용"],
          parking: item["주차가능여부"],
          wifi: item["와이파이제공여부"],
          delivery: item["배달서비스유무"],
          reservation: item["온라인예약정보내용"],
          homepageLinks: (item["홈페이지(URL)"] || "")
            .split(",")
            .map((url) => url.trim())
            .filter(Boolean),
          representativeMenu: item["대표메뉴명"],
          hashtags: item["해시태그"],
          landmark: item["인근랜드마크명"],
          playroom: item["놀이방유무"],
          multilingualMenu: item["다국어메뉴판제공여부"],
          smartOrder: item["스마트오더유무"],
          restroom: item["화장실정보내용"],
        }))
        .filter((item) =>
          (!areaFilter || item.area === areaFilter) &&
          Object.entries(facilityFilters).every(([key, enabled]) => !enabled || item[key] === "Y")
        );
      setResults(restaurants);
      setCurrentPage(1);
    } catch (requestError) {
      console.error("API 호출 오류", requestError);
      setResults([]);
      setError(requestError.message || "식당 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [areaFilter, facilityFilters]);

  const paginatedResults = useMemo(() => {
    const sorted = [...results].sort(SORT_OPTIONS[sortBy]);
    const start = (currentPage - 1) * itemsPerPage;
    return sorted.slice(start, start + itemsPerPage);
  }, [currentPage, results, sortBy]);

  const totalPages = Math.ceil(results.length / itemsPerPage);
  const activeFilterCount = Number(Boolean(areaFilter)) + Object.values(facilityFilters).filter(Boolean).length;
  const detailItems = selectedRestaurant
    ? [
        ["영업시간", displayValue(selectedRestaurant.businessHours)],
        ["휴무일", displayValue(selectedRestaurant.closedDays)],
        ["주차", availability(selectedRestaurant.parking)],
        ["와이파이", availability(selectedRestaurant.wifi, "제공", "미제공")],
        ["배달", availability(selectedRestaurant.delivery)],
        ["온라인 예약", displayValue(selectedRestaurant.reservation)],
        ["놀이방", availability(selectedRestaurant.playroom)],
        ["다국어 메뉴", availability(selectedRestaurant.multilingualMenu, "제공", "미제공")],
        ["스마트오더", availability(selectedRestaurant.smartOrder)],
        ["화장실", availability(selectedRestaurant.restroom, "있음", "없음")],
      ]
    : [];

  const resetFilters = () => {
    setAreaFilter("");
    setFacilityFilters({});
    setIsAreaMenuOpen(false);
  };

  const toggleFacility = (key) => {
    setFacilityFilters((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="맛콩이 맛집 홈">
          <span className="brand-mark">M</span>
          <span>맛콩이<span className="brand-accent">.</span></span>
        </a>
        <div className="topbar-label">SEOUL RESTAURANT OPERATIONS</div>
        <button className="topbar-button" onClick={fetchRestaurants}>식당 둘러보기</button>
      </header>

      <main id="top" className="dashboard">
        <aside className="filter-rail">
          <div className="filter-heading">
            <p>SEARCH FILTER</p>
            <h1>오늘의 식당<br />운영 정보</h1>
          </div>
          <p className="filter-copy">서울관광재단이 제공하는 식당 운영 데이터를 기준으로 찾습니다.</p>

          <div className="filter-group area-filter">
            <label id="area-label">지역</label>
            <div className="area-dropdown">
              <button
                type="button"
                className="area-trigger"
                aria-labelledby="area-label"
                aria-expanded={isAreaMenuOpen}
                onClick={() => setIsAreaMenuOpen((open) => !open)}
              >
                {areaFilter || "서울 전체"}<span>⌄</span>
              </button>
              {isAreaMenuOpen && (
                <div className="area-menu" role="listbox" aria-label="지역 선택">
                  {["", ...SEOUL_AREAS].map((area) => (
                    <button
                      type="button"
                      role="option"
                      aria-selected={area === areaFilter}
                      className={area === areaFilter ? "selected" : ""}
                      key={area || "all"}
                      onClick={() => {
                        setAreaFilter(area);
                        setIsAreaMenuOpen(false);
                      }}
                    >
                      {area || "서울 전체"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <fieldset className="facility-filters">
            <legend>세부 조건</legend>
            {FACILITY_FILTERS.map(([key, label]) => (
              <label key={key} className={facilityFilters[key] ? "checked" : ""}>
                <input type="checkbox" checked={Boolean(facilityFilters[key])} onChange={() => toggleFacility(key)} />
                <span>{label}</span>
              </label>
            ))}
          </fieldset>

          <button className="search-button" onClick={fetchRestaurants} disabled={isLoading}>
            {isLoading ? "불러오는 중..." : "식당 찾기"}
          </button>
          {activeFilterCount > 0 && <button className="reset-button" onClick={resetFilters}>필터 초기화</button>}

          <div className="source-note">
            <span>DATA SOURCE</span>
            서울관광재단<br />식당운영정보 API
          </div>
        </aside>

        <section className="content-area">
          <div className="welcome-panel">
            <div>
              <p className="eyebrow">SMART DINING GUIDE</p>
              <h2>식당의 <em>지금</em>을<br />확인하세요.</h2>
            </div>
            <div className="welcome-orb">🍽️</div>
          </div>

          <div className="result-toolbar">
            <div>
              <p className="eyebrow">DISCOVER</p>
              <h3>{results.length ? `${results.length.toLocaleString()}개의 식당` : "식당을 검색해 보세요"}</h3>
            </div>
            {results.length > 0 && (
              <select className="sort-select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="이름순">이름순</option>
                <option value="영업시간순">영업시간순</option>
                <option value="대표메뉴순">대표 메뉴순</option>
              </select>
            )}
          </div>

          {isLoading ? (
            <div className="empty-state loading-state"><span className="loader" />운영 정보를 불러오고 있어요.</div>
          ) : paginatedResults.length > 0 ? (
            <div className="restaurant-grid">
              {paginatedResults.map((place) => (
                <button className="restaurant-card" key={place.id} onClick={() => setSelectedRestaurant(place)}>
                  <div className="card-topline"><span>{place.area}</span><span className="status-dot">{place.status === "NORMAL" ? "● 정상 운영" : place.status || "상태 미상"}</span></div>
                  <h4>{place.title}</h4>
                  {place.representativeMenu && <p className="menu-name">{place.representativeMenu}</p>}
                  {place.businessHours && <div className="hours"><span>OPENING HOURS</span>{place.businessHours}</div>}
                  <div className="facility-row">
                    <span className={place.parking === "Y" ? "on" : ""}>P {availability(place.parking)}</span>
                    <span className={place.wifi === "Y" ? "on" : ""}>W {availability(place.wifi, "Wi-Fi", "Wi-Fi 없음")}</span>
                    <span className={place.delivery === "Y" ? "on" : ""}>D {availability(place.delivery)}</span>
                  </div>
                  <span className="card-arrow">↗</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="empty-state">{error || "왼쪽 조건을 고른 뒤 식당 찾기를 눌러주세요."}</div>
          )}

          {totalPages > 1 && (
            <nav className="pagination" aria-label="검색 결과 페이지">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button key={page} className={page === currentPage ? "active" : ""} onClick={() => setCurrentPage(page)}>{page}</button>
              ))}
            </nav>
          )}
        </section>
      </main>

      {selectedRestaurant && (
        <div className="modal-backdrop" onMouseDown={() => setSelectedRestaurant(null)}>
          <section className="restaurant-modal" role="dialog" aria-modal="true" aria-label={`${selectedRestaurant.title} 운영 정보`} onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedRestaurant(null)} aria-label="닫기">×</button>
            <p className="eyebrow">RESTAURANT OPERATIONS</p>
            <h2>{selectedRestaurant.title}</h2>
            <p className="modal-menu">{displayValue(selectedRestaurant.representativeMenu)}</p>
            <section className="landmark-card">
              <span className="landmark-icon">📍</span>
              <div><span>인근 랜드마크</span><strong>{displayValue(selectedRestaurant.landmark)}</strong></div>
            </section>
            <div className="details-grid">
              {detailItems.map(([label, value]) => (
                <div key={label}><span>{label}</span><strong>{value}</strong></div>
              ))}
            </div>
            <p className="tags">{selectedRestaurant.hashtags || "🙈 해시태그 정보 없음"}</p>
            <div className="homepage-section">
              <span>홈페이지</span>
              {selectedRestaurant.homepageLinks.length > 0 ? (
                <div className="homepage-links">
                {selectedRestaurant.homepageLinks.map((url) => (
                  <a className="homepage-link" href={url} key={url} target="_blank" rel="noreferrer">홈페이지 방문 ↗</a>
                ))}
                </div>
              ) : <strong>🙈 미제공</strong>}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
