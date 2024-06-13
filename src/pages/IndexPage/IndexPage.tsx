import {Cell, List, Placeholder, Section} from '@telegram-apps/telegram-ui';
import type {FC} from 'react';

import './IndexPage.css';
import {Link} from "@/components/Link/Link";

export const IndexPage: FC = () => {
  return (
      <>
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
