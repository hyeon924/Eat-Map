import { useState } from 'react'
import './App.css'

const AREA_CODE = {
  서울: 1,
  부산: 6,
  대전: 3,
  대구: 4,
};

const API_KEY = 'hwKboOwuhveCrE%2FPzOpQq5JXiVuXVQkDddlhVPSPwa%2BNp4uM2QvIRDBXNdYa%2BJ9fqTGVPok6VBDA6tnOqVm70A%3D%3D';

function App() {

  const [region, setRegion] = useState('서울');
  const [category, setCategory] = useState('한식');
  const [results, setResults] = useState([]);

  const fetchRestaurants = async (region, category) => {
    const areaCode = AREA_CODE[region];

    const url = `https://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=${API_KEY}&MobileOS=ETC&MobileApp=EatMap&_type=json&contentTypeId=39&areaCode=${areaCode}`;

    try {
      const response = await fetch(url);
      const json = await response.json();
      const items = json.response.body.items.item;
      console.log('받아온 음식점 목록:', items);
      setResults(items);
    } catch (err) {
      console.log('API 호출 오류', err);
    }
  };

  const handleSearch = () => {
    fetchRestaurants(region, category);
    // console.log('선택된 지역', region);
    // console.log('선택된 종류', category);
  }

  return (
    <div className="min-h-screen w-screen flex flex-col items-center bg-white overflow-auto py-10">
      <h1 className="text-blue-600 text-2xl font-bold text-center mb-6">
        🍽 전국 맛집 지도 서비스
      </h1>

      <div className="flex gap-4 mb-4">
        <select className="border px-4 py-2 rounded" value={region} onChange={(e) => setRegion(e.target.value)}>
          <option>서울</option>
          <option>부산</option>
          <option>대전</option>
          <option>대구</option>
        </select>

        <select className="border px-4 py-2 rounded" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>한식</option>
          <option>중식</option>
          <option>일식</option>
          <option>양식</option>
        </select>

        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          검색
        </button>
      </div>

      {/* 검색결과 출력 */}
      <div className="w-full max-w-xl">
        {results.length > 0 ? (
          <ul className="space-y-2">
            {results.map((place) => (
              <li key={place.contentid} className="border p-4 rounded shadow">
                <h2 className="font-bold">{place.title}</h2>
                <p className="text-sm text-gray-600">{place.addr1}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">검색 결과가 여기에 표시됩니다.</p>
        )}
      </div>
    </div>
  );

}


export default App;
