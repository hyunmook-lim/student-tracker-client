import React from 'react';
import { useWrongPatternStore } from '../store';
import { Treemap, Tooltip, ResponsiveContainer } from 'recharts';
import './WrongPatternModal.css';

function WrongPatternModal({ classData, isOpen, onClose }) {
  const { getSeverityColor } = useWrongPatternStore();

  if (!isOpen || !classData) return null;

  // 난이도 정의
  const difficultyLevels = ['중', '중상', '상', '최상'];

  // 단원별 난이도별 오답 데이터 (실제로는 API에서 받아올 데이터)
  const heatmapData = [
    {
      unit: 'JavaScript 변수',
      difficulties: { 중: 15, 중상: 25, 상: 35, 최상: 45 },
    },
    {
      unit: 'CSS Flexbox',
      difficulties: { 중: 10, 중상: 20, 상: 30, 최상: 40 },
    },
    {
      unit: 'HTML 시맨틱',
      difficulties: { 중: 5, 중상: 15, 상: 25, 최상: 35 },
    },
    {
      unit: '이벤트 처리',
      difficulties: { 중: 20, 중상: 30, 상: 40, 최상: 50 },
    },
    {
      unit: '비동기 프로그래밍',
      difficulties: { 중: 25, 중상: 35, 상: 45, 최상: 55 },
    },
  ];

  // 트리맵 데이터 (계층적 구조)
  const treemapData = [
    {
      name: 'JavaScript 기초',
      children: [
        { name: '변수와 상수', size: 30 },
        { name: '데이터 타입', size: 20 },
        { name: '연산자', size: 25 },
        { name: '조건문', size: 35 },
      ],
    },
    {
      name: 'CSS 스타일링',
      children: [
        { name: '선택자', size: 15 },
        { name: '박스 모델', size: 20 },
        { name: 'Flexbox', size: 25 },
        { name: 'Grid', size: 30 },
      ],
    },
    {
      name: 'HTML 구조',
      children: [
        { name: '시맨틱 태그', size: 10 },
        { name: '폼 요소', size: 15 },
        { name: '멀티미디어', size: 20 },
      ],
    },
    {
      name: 'DOM 조작',
      children: [
        { name: '요소 선택', size: 30 },
        { name: '요소 생성/삭제', size: 40 },
        { name: '이벤트 리스너', size: 35 },
        { name: '스타일 조작', size: 25 },
      ],
    },
    {
      name: '이벤트 시스템',
      children: [
        { name: '이벤트 타입', size: 35 },
        { name: '이벤트 전파', size: 45 },
        { name: '이벤트 위임', size: 50 },
        { name: '커스텀 이벤트', size: 40 },
      ],
    },
    {
      name: '비동기 처리',
      children: [
        { name: 'Promise', size: 50 },
        { name: 'async/await', size: 60 },
        { name: '콜백 함수', size: 45 },
        { name: '이벤트 루프', size: 55 },
      ],
    },
    {
      name: 'API 통신',
      children: [
        { name: 'fetch API', size: 35 },
        { name: 'REST API', size: 40 },
        { name: 'JSON 처리', size: 30 },
        { name: '에러 처리', size: 45 },
      ],
    },
    {
      name: '프레임워크 기초',
      children: [
        { name: 'React 기초', size: 25 },
        { name: '컴포넌트', size: 30 },
        { name: '상태 관리', size: 35 },
        { name: '라우팅', size: 20 },
      ],
    },
  ];

  // 오답률 top3 대단원 데이터
  const top3Units = [
    {
      name: '비동기 처리',
      wrongRate: 60,
      color: '#ef4444',
      subUnits: [
        { name: 'Promise', wrongRate: 70 },
        { name: 'async/await', wrongRate: 65 },
        { name: '콜백 함수', wrongRate: 55 },
      ],
    },
    {
      name: '이벤트 시스템',
      wrongRate: 50,
      color: '#f59e0b',
      subUnits: [
        { name: '이벤트 위임', wrongRate: 60 },
        { name: '이벤트 전파', wrongRate: 55 },
        { name: '커스텀 이벤트', wrongRate: 45 },
      ],
    },
    {
      name: 'API 통신',
      wrongRate: 45,
      color: '#10b981',
      subUnits: [
        { name: 'fetch API', wrongRate: 50 },
        { name: 'REST API', wrongRate: 45 },
        { name: '에러 처리', wrongRate: 40 },
      ],
    },
  ];

  const COLORS = [
    '#ef4444',
    '#f59e0b',
    '#10b981',
    '#ef4444',
    '#dc2626',
    '#991b1b',
    '#ef4444',
    '#f59e0b',
  ];

  // 색상 강도 계산
  const getColorIntensity = percentage => {
    if (percentage <= 10) return 0.1;
    if (percentage <= 20) return 0.3;
    if (percentage <= 30) return 0.5;
    if (percentage <= 40) return 0.7;
    return 0.9;
  };

  // 색상 계산
  const getHeatmapColor = percentage => {
    const intensity = getColorIntensity(percentage);
    const red = Math.round(239 * intensity);
    const green = Math.round(68 * (1 - intensity));
    const blue = Math.round(68 * (1 - intensity));
    return `rgb(${red}, ${green}, ${blue})`;
  };

  // CustomContentTreeMap 컴포넌트
  const CustomContentTreeMap = props => {
    const { root, depth, x, y, width, height, index, name } = props;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill:
              depth < 2
                ? COLORS[Math.floor((index / root.children.length) * 8)]
                : '#ffffff00',
            stroke: '#fff',
            strokeWidth: 2 / (depth + 1e-10),
            strokeOpacity: 1 / (depth + 1e-10),
          }}
        />
        {depth === 1 ? (
          <text
            x={x + width / 2}
            y={y + height / 2 + 7}
            textAnchor='middle'
            fill='#fff'
            fontSize={14}
          >
            {name}
          </text>
        ) : null}
        {depth === 1 ? (
          <text
            x={x + 4}
            y={y + 18}
            fill='#fff'
            fontSize={16}
            fillOpacity={0.9}
          >
            {index + 1}
          </text>
        ) : null}
        {depth === 2 && width > 60 && height > 30 ? (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor='middle'
            fill='#fff'
            fontSize={12}
          >
            {name}
          </text>
        ) : null}
      </g>
    );
  };

  // 트리맵 커스텀 툴팁 컴포넌트
  const TreemapTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isMainSection = !data.children;
      return (
        <div className='custom-tooltip'>
          <p className='tooltip-label'>{data.name}</p>
          <p className='tooltip-content'>오답률: {data.size}%</p>
          {!isMainSection && (
            <p className='tooltip-content'>대단원: {data.parentName}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className='wrong-pattern-modal-overlay' onClick={onClose}>
      <div className='wrong-pattern-modal' onClick={e => e.stopPropagation()}>
        <div className='modal-header'>
          <h2>{classData.name} - 오답패턴 분석</h2>
          <button className='close-button' onClick={onClose}>
            ✕
          </button>
        </div>

        <div className='modal-content'>
          <div className='content-layout'>
            {/* 왼쪽 섹션 */}
            <div className='left-section'>
              {/* 전체 통계 */}
              <div className='overall-stats'>
                <div className='stat-card'>
                  <div className='stat-number'>
                    {classData?.totalQuestions || 0}
                  </div>
                  <div className='stat-label'>총 문제 수</div>
                </div>
                <div className='stat-card'>
                  <div className='stat-number wrong'>
                    {classData?.wrongQuestions || 0}
                  </div>
                  <div className='stat-label'>오답 수</div>
                </div>
                <div className='stat-card'>
                  <div
                    className='stat-number'
                    style={{
                      color: getSeverityColor(classData?.wrongRate || 0),
                    }}
                  >
                    {classData?.wrongRate || 0}%
                  </div>
                  <div className='stat-label'>오답률</div>
                </div>
              </div>

              {/* 오답률 top3 */}
              <div className='top3-section'>
                <h3>오답률 Top 3</h3>
                <div className='top3-cards'>
                  {top3Units.map((unit, index) => (
                    <div key={index} className='top3-card'>
                      <div className='card-inner'>
                        <div className='card-front'>
                          <div className='front-content'>
                            <div className='rank-badge'>{index + 1}</div>
                            <div className='unit-name'>{unit.name}</div>
                            <div
                              className='unit-wrong-rate'
                              style={{ color: unit.color }}
                            >
                              {unit.wrongRate}%
                            </div>
                          </div>
                        </div>
                        <div className='card-back'>
                          <div className='sub-units-list'>
                            {unit.subUnits.map((subUnit, subIndex) => (
                              <div key={subIndex} className='sub-unit-item'>
                                <div className='sub-unit-name'>
                                  {subUnit.name}
                                </div>
                                <div
                                  className='sub-unit-rate'
                                  style={{ color: unit.color }}
                                >
                                  {subUnit.wrongRate}%
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 오른쪽 섹션 */}
            <div className='right-section'>
              {/* 히트맵 */}
              <div className='heatmap-section'>
                <h3>단원별 난이도 오답률 히트맵</h3>
                <div className='heatmap-container'>
                  <div className='heatmap-header'>
                    <div className='heatmap-corner'></div>
                    {difficultyLevels.map(level => (
                      <div key={level} className='heatmap-header-cell'>
                        {level}
                      </div>
                    ))}
                  </div>
                  <div className='heatmap-body'>
                    {heatmapData.map((item, rowIndex) => (
                      <div key={rowIndex} className='heatmap-row'>
                        <div className='heatmap-row-header'>{item.unit}</div>
                        {difficultyLevels.map((level, colIndex) => {
                          const percentage = item.difficulties[level];
                          return (
                            <div
                              key={colIndex}
                              className='heatmap-cell'
                              style={{
                                backgroundColor: getHeatmapColor(percentage),
                                color: percentage > 30 ? 'white' : '#1e293b',
                              }}
                              title={`${item.unit} - ${level} 난이도: ${percentage}% 오답률`}
                            >
                              {percentage}%
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 범례 */}
                <div className='heatmap-legend'>
                  <div className='legend-item'>
                    <div
                      className='legend-color'
                      style={{ backgroundColor: 'rgb(239, 68, 68)' }}
                    ></div>
                    <span>높음 (40% 이상)</span>
                  </div>
                  <div className='legend-item'>
                    <div
                      className='legend-color'
                      style={{ backgroundColor: 'rgb(239, 119, 68)' }}
                    ></div>
                    <span>중간 (20-39%)</span>
                  </div>
                  <div className='legend-item'>
                    <div
                      className='legend-color'
                      style={{ backgroundColor: 'rgb(239, 170, 68)' }}
                    ></div>
                    <span>낮음 (10-19%)</span>
                  </div>
                  <div className='legend-item'>
                    <div
                      className='legend-color'
                      style={{ backgroundColor: 'rgb(239, 221, 68)' }}
                    ></div>
                    <span>매우 낮음 (10% 미만)</span>
                  </div>
                </div>
              </div>

              {/* 트리맵 섹션 */}
              <div className='treemap-section'>
                <h3>대단원별 오답률 분석</h3>
                <div className='treemap-container'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <Treemap
                      data={treemapData}
                      dataKey='size'
                      aspectRatio={4 / 3}
                      stroke='#fff'
                      fill='#8884d8'
                      content={<CustomContentTreeMap />}
                    >
                      <Tooltip content={<TreemapTooltip />} />
                    </Treemap>
                  </ResponsiveContainer>
                </div>

                {/* 트리맵 범례 */}
                <div className='treemap-legend'>
                  <div className='legend-item'>
                    <div className='legend-color high'></div>
                    <span>높은 오답률 (40% 이상)</span>
                  </div>
                  <div className='legend-item'>
                    <div className='legend-color medium'></div>
                    <span>중간 오답률 (20-39%)</span>
                  </div>
                  <div className='legend-item'>
                    <div className='legend-color low'></div>
                    <span>낮은 오답률 (20% 미만)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WrongPatternModal;
