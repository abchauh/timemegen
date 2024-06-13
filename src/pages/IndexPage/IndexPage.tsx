import {Placeholder} from '@telegram-apps/telegram-ui';
import type {FC} from 'react';

import welcomeImg from './cat.jpg';

import './IndexPage.css';

export const IndexPage: FC = () => {
  return (
    <Placeholder header="TIMEME GENERATOR"
                 description="soon...">
      <img
        alt="its TIME"
        src={welcomeImg}
        style={{ display: 'block', width: '144px', height: '144px' }}
      />
    </Placeholder>
  );
};
