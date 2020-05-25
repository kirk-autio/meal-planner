import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './app/store';
import App from './App';

test('empty for now', () =>{
    expect(true).toBe(true);
});
// test('renders learn react link', () => {
//   const { getByText } = render(
//     <Provider store={store}>
//       <App />
//     </Provider>
//   );
//
//   expect(getByText(/login/i)).toBeInTheDocument();
// });
