import Teacher from './teacher/Teacher'
import { ConversationProvider } from './conversation';
import { SettingsProvider } from './Settings';

function App() {
  return (
    <SettingsProvider>
      <ConversationProvider>
        <Teacher />
      </ConversationProvider>
    </SettingsProvider>
  );
}

export default App;