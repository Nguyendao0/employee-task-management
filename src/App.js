import './App.css';
import Employee from './components/Employee.js';
import Header from './components/Header';
import FormVerify from './components/FormVerify';
import Container from 'react-bootstrap/Container';
import TestSMS from './components/TestSMS';

function App() {
  return (
    <div>
      <Container>
        <Header />
        <TestSMS />
        {/* <FormVerify />
        <Employee /> */}
      </Container>
    </div>
  );
}

export default App;
