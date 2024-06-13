import type {ComponentType, JSX} from 'react';

import {IndexPage} from '@/pages/IndexPage/IndexPage';
import { XRaidPage } from '@/pages/IndexPage/XRaidPage';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: IndexPage },
  { path: '/x-raid', Component: XRaidPage, title: 'X Raid' },
];
