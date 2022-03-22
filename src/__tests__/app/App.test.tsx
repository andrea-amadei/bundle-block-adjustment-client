import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from '../../renderer/App';

// eslint-disable-next-line jest/no-export
export default () =>
  describe('App', () => {
    test('should render', () => {
      expect(render(<App />)).toBeTruthy();
    });
  });
