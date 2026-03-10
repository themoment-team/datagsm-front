'use client';

interface LoginButtonProps {
  type?: 'default' | 'icon';
  variant?: 'white' | 'black' | 'gray';
}

export const LoginButton = ({ type = 'default', variant = 'white' }: LoginButtonProps) => {
  const isWhite = variant === 'white';
  const isBlack = variant === 'black';
  const isGray = variant === 'gray';

  const styles = {
    height: type === 'icon' ? '70px' : '40px',
    width: type === 'icon' ? '70px' : 'auto',
    padding: type === 'icon' ? '0' : '0 12px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: type === 'icon' ? '50%' : '8px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    fontFamily:
      "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif",
    transition: 'all 0.2s ease-in-out',
    border: isGray ? '1px solid #E5E5E5' : 'none',
    backgroundColor: isWhite ? '#FFFFFF' : isBlack ? '#000000' : '#EFEFEF',
    color: isWhite ? '#000000' : isBlack ? '#FFFFFF' : '#000000',
  };

  const logoSrc = isWhite || isGray ? '/images/docs/DG_black.png' : '/images/docs/DG_white.png';

  return (
    <div style={styles} className="shadow-sm hover:opacity-90 active:scale-[0.98]">
      <img src={logoSrc} alt="logo" style={{ height: '16px' }} />
      {type === 'default' && (
        <span style={{ marginLeft: '16px', fontSize: '16px' }}>DataGSM으로 로그인</span>
      )}
    </div>
  );
};
