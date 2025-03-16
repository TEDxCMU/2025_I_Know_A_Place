import Header from '../components/Header/Header';
import InfoPanel from '../components/InfoPanel/InfoPanel';

import dynamic from 'next/dynamic';
import SearchBar from '../components/SearchBar/SearchBar';

function HomePage() {
    const Map = dynamic(() => import('@/app/components/StoryMapView/StoryMapView'), {
        loading: () => 
        <div style={{ 
            height: "76vh", 
            display: "flex", 
            justifyContent: "center",  // Centers horizontally
            alignItems: "center",  // Centers vertically
            textAlign: "center" 
        }}>
            <p>A map is loading</p>
        </div>,
        ssr: false,  // Disable SSR if needed for client-only components
      });

    return (
        <>
            <InfoPanel />
            <SearchBar />
            <Map />
        </>
    );
}

export default HomePage;
