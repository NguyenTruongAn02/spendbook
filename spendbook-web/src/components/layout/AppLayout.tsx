import { Layout, Grid } from 'antd';
import { ReactNode } from 'react';
import HeaderSummary from './HeaderSummary';
import DesktopNav from './DesktopNav';
import MobileBottomNav from './MobileBottomNav';

const { Header, Content } = Layout;
const { useBreakpoint } = Grid;

interface Props {
    children: ReactNode;
}

export default function AppLayout({ children }: Props) {
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{
                padding: 0,
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}>
                <HeaderSummary />
                {!isMobile && <DesktopNav />}
            </Header>

            <Content style={{ padding: isMobile ? '8px 8px 72px' : '16px 24px' }}>
                {children}
            </Content>

            {isMobile && <MobileBottomNav />}
        </Layout>
    );
}
