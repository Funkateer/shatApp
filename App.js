import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

// import the navigation screens
import Start from './components/Start';
import Chat from './components/Chat';

// Create the navigator with 2 screens
const navigator = createStackNavigator({
  Start: { screen: Start },
  Chat: { screen: Chat }
});

const navigatorContainer = createAppContainer(navigator);
// Export it as the root component
export default navigatorContainer;
