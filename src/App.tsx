import './App.css';
import Home from './components/Home';
import StreamProvider from './components/StreamProvider';
import TokenProvider from './components/TokenProvider';

function App() {
	return (
		<TokenProvider>
			<StreamProvider>
				<Home />
			</StreamProvider>
		</TokenProvider>
	);
}

export default App;
