import {Cell, List, Placeholder, Section} from '@telegram-apps/telegram-ui';
import type {FC} from 'react';

import welcomeImg from './cat.jpg';

import './IndexPage.css';
import {Link} from "@/components/Link/Link";

export const IndexPage: FC = () => {
  return (
      <>

    <Placeholder header="$TIME MEMES GENERATOR">
      <img
        alt="its TIME"
        src={welcomeImg}
        style={{ display: 'block', width: '144px', height: '144px' }}
      />
    </Placeholder>
    <List>
      <Section
        header='Meme Generation Variants'
        footer=''
      >
      <Link to='/x-raid'>
        <Cell subtitle='Generate a meme based on the X post URL.'>X RAID</Cell>
      </Link>
      </Section>
    </List>
      </>
  );
};
