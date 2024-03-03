import React from 'react';
import {
  Drawer,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Navbar,
  MobileNav,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Card,
} from "@material-tailwind/react";
import {
  CubeTransparentIcon,
  UserCircleIcon,
  CodeBracketSquareIcon,
  Square3Stack3DIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  RocketLaunchIcon,
  Bars2Icon,
} from "@heroicons/react/24/solid";
import { useHistory } from 'react-router-dom';
import { localStore } from '../../services/browserStorage';
import { AuthService, PostService } from '../../services/endpoints';
import MyCard from '../../Components/Card';





const Home = () => {
  const [images, setImages] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const history = useHistory();
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await PostService.getPosts(page);
      console.log('response', response);
      setImages(prevImages => [...prevImages, ...response.data.posts]);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    try {
      const response = AuthService.logOut();
      if (response) {
        localStore.clear();
        history.push('/login');
      }
    } catch (error) {
      console.error('Error while logging out', error);
    }
  };

  const handleDrawerOpen = (e) => {
    // If the mouse is on the extreme left, open the drawer
    if (e.clientX === 0) openDrawer();

  };

  const handleScroll = () => {
    const sum = window.scrollY + window.innerHeight;
    const rhs = document.documentElement.scrollHeight;
    const diff = rhs - sum;
    if (diff < 10) fetchImages();
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleDrawerOpen);
    // Also if it is a touch device, then add touch event listeners
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div style={{ minHeight: 'calc(100vh - 4rem)', padding: '1rem' }}>
      <Navbar className="sticky top-0 z-10 mx-auto max-w-screen-xl p-2 lg:rounded-full lg:pl-6">
        <div className="relative mx-auto flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          className="mr-4 ml-2 cursor-pointer py-1.5 font-medium"
        >
          Focal Media
        </Typography>
        <Button size="sm" variant="text" onClick={handleLogout}>
          <span>Log Out</span>
        </Button>
      </div>
      </Navbar>

        <div className="container mx-auto py-8">
        <h1 className="text-3xl font-semibold text-center mb-8">Image List</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {images.map((image, index) => (
              <MyCard
                key={index}
                imageLink={image.imageLink}
                caption={image.caption}
                onButtonClick={() => window.open(image.imageLink)}
                />
          ))}
        </div>
        {loading && <p className="text-center mt-4">Loading...</p>}
      </div>
    </div>
  );
};

export default Home;