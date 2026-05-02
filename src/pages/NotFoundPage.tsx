import { useNavigate } from 'react-router-dom';
import { Button } from '../components/shared/Button';
import { PageTransition } from '../components/layout/PageTransition';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <PageTransition>
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 text-center px-4">
        <span className="text-8xl">🧊</span>
        <h1 className="text-6xl font-900 text-gray-800">404</h1>
        <p className="text-gray-400 font-600">페이지를 찾을 수 없어요!</p>
        <Button onClick={() => navigate('/')}>🏠 처음으로</Button>
      </div>
    </PageTransition>
  );
}
