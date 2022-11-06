import { screen } from '@testing-library/react';
import { renderWithProviders as render } from '../test-utils';
import App from './App';


test('renders App component', () => {
  render(<App />);
});
