import App from '../App';
import MessagePage from '../Pages/MessagePage';
import ProfilePage from '../Pages/ProfilePage'
import SearchPage from '../Pages/SearchPage';
import SignUp from '../Pages/SignUp';
import HomePage from '../Pages/HomePage';

const routes = [
    {
        path: '/',
        element: <App />
    },
    {
        path: '/home',
        element: <HomePage />
    },
    //Naming is weird, but messagepage is really
    //Conversation page
    {
        path: '/messages/:conversationId',
        element: <MessagePage />
    },
    {
        path: '/profile/:userID',
        element: <ProfilePage />
    },
    {
        path: '/search',
        element: <SearchPage />
    },
    {
        path: '/signup',
        element: <SignUp />
    }
]
export default routes;