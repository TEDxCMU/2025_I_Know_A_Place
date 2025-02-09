import Header from '../components/Header/Header';
import InfoPanel from '../components/InfoPanel/InfoPanel';

import dynamic from 'next/dynamic';

function HomePage() {
    const Map = dynamic(() => import('@/app/components/StoryMapView/StoryMapView'), {
        loading: () => <p>A map is loading</p>,
        ssr: false,  // Disable SSR if needed for client-only components
      });

    return (
        <>
            <InfoPanel />
            <Map />
        </>
    );
}

export default HomePage;
