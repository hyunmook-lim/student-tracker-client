import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportToPDF = async (elementId, filename = 'export.pdf') => {
  try {
    // PDF 전용 요소가 아닌 원래 요소를 찾기
    let targetElementId = elementId;
    if (elementId.includes('-pdf-content')) {
      // PDF 전용 요소 ID를 원래 요소 ID로 변경
      targetElementId = elementId.replace('-pdf-content', '-content');
    }

    const element = document.getElementById(targetElementId);
    if (!element) {
      console.error('Element not found:', targetElementId);
      return;
    }

    // GradeDetailModal인지 확인 (세로 출력을 위해)
    const isGradeDetailModal = targetElementId === 'grade-detail-content';

    // PDF 출력을 위해 임시 스타일 적용
    const styleElement = document.createElement('style');
    styleElement.setAttribute('data-temp-pdf', 'true');
    styleElement.innerHTML = `
      /* PDF 버튼과 닫기 버튼만 숨기기 */
      .modal-buttons {
        display: none !important;
      }
      
      /* 모든 모달의 스크롤 요소들 PDF용 처리 */
      .lecture-detail-modal-content,
      .grade-detail-modal-content,
      .wrong-pattern-modal {
        overflow: visible !important;
        height: auto !important;
        max-height: none !important;
      }
      
      /* LectureDetailModal 스크롤 요소들 */
      .lecture-detail-modal-content .homework-list,
      .lecture-detail-modal-content .problems-list {
        overflow: visible !important;
        max-height: none !important;
      }
      
      /* GradeDetailModal 스크롤 요소들 */
      .grade-detail-modal-content .score-table-container,
      .grade-detail-modal-content .attendance-list,
      .grade-detail-modal-content .assignment-list,
      .grade-detail-modal-content .wrong-unit-list,
      .grade-detail-modal-content .wrong-difficulty-list {
        overflow: visible !important;
        max-height: none !important;
      }
      
      /* WrongPatternModal 스크롤 요소들 */
      .wrong-pattern-modal .heatmap-container,
      .wrong-pattern-modal .assignment-stats,
      .wrong-pattern-modal .top3-cards {
        overflow: visible !important;
        max-height: none !important;
      }
      
      /* 카드 호버 효과 비활성화 */
      .wrong-pattern-modal .top3-card:hover .card-inner {
        transform: none !important;
      }
      .wrong-pattern-modal .card-inner {
        transform: none !important;
      }
      .wrong-pattern-modal .card-front {
        transform: none !important;
        backface-visibility: visible !important;
      }
      .wrong-pattern-modal .card-back {
        transform: rotateX(180deg) !important;
        backface-visibility: hidden !important;
        display: none !important;
      }
      

    `;
    document.head.appendChild(styleElement);

    // 차트가 렌더링될 시간을 주기 위해 약간의 지연
    await new Promise(resolve => setTimeout(resolve, 300));

    // html2canvas 옵션 설정 (고해상도)
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      logging: false,
    });

    // 고품질 PNG로 변환
    const imgData = canvas.toDataURL('image/png');

    // PDF 생성 (GradeDetailModal은 세로, 나머지는 가로)
    const pdf = new jsPDF({
      orientation: isGradeDetailModal ? 'portrait' : 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // A4 크기 계산
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // 이미지 비율에 맞춰 크기 조정
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgScaledWidth = imgWidth * ratio;
    const imgScaledHeight = imgHeight * ratio;

    // 여러 페이지로 나누어 출력
    let heightLeft = imgScaledHeight;
    let position = 0;

    // 첫 번째 페이지
    pdf.addImage(imgData, 'PNG', 0, position, imgScaledWidth, imgScaledHeight);
    heightLeft -= pdfHeight;

    // 추가 페이지가 필요한 경우
    while (heightLeft >= 0) {
      position = heightLeft - imgScaledHeight;
      pdf.addPage();
      pdf.addImage(
        imgData,
        'PNG',
        0,
        position,
        imgScaledWidth,
        imgScaledHeight
      );
      heightLeft -= pdfHeight;
    }

    // PDF 다운로드
    pdf.save(filename);

    // 임시 스타일 제거
    document.head.removeChild(styleElement);
  } catch (error) {
    console.error('PDF export failed:', error);
    alert('PDF 내보내기 중 오류가 발생했습니다.');

    // 오류 발생시에도 임시 스타일 제거
    const tempStyle = document.querySelector('style[data-temp-pdf="true"]');
    if (tempStyle) {
      document.head.removeChild(tempStyle);
    }
  }
};
