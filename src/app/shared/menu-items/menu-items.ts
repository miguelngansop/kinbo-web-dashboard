import { Injectable } from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}
export interface Saperator {
  name: string;
  type?: string;
}
export interface SubChildren {
  state: string;
  name: string;
  type?: string;
}
export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
  child?: SubChildren[];
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  saperator?: Saperator[];
  children?: ChildrenItems[];
}

const MENUITEMS = [

  {
    state: 'dashboard',
    name: 'Tableau de bord',
    type: 'link',
    icon: 'av_timer'
  },
  {
    state: '',
    name: 'Gestion',
    type: 'saperator',
    icon: 'av_timer'
  },
  {
    state: 'artists',
    name: 'Artistes',
    type: 'link',
    icon: 'people'
  },
  {
    state: 'genres',
    name: 'Genres musicaux',
    type: 'link',
    icon: 'note'
  },
  {
    state: 'musics',
    name: 'Musiques',
    type: 'link',
    icon: 'music_note'
  },
  {
    state: 'albums',
    name: 'Albums',
    type: 'link',
    icon: 'library_music'
  },
  {
    state: 'playlists',
    name: 'Playlists',
    type: 'link',
    icon: 'queue_music'
  },
  {
    state: 'diffusion',
    name: 'Diffusion',
    type: 'link',
    icon: 'online_prediction'
  },
  // {
  //   state: 'material',
  //   name: 'Material Ui',
  //   type: 'sub',
  //   icon: 'bubble_chart',
  //   badge: [{ type: 'red', value: '17' }],
  //   children: [
  //     { state: 'badge', name: 'Badge', type: 'link' },
  //     { state: 'button', name: 'Buttons', type: 'link' },
  //     { state: 'cards', name: 'Cards', type: 'link' },
  //     { state: 'grid', name: 'Grid List', type: 'link' },
  //     { state: 'lists', name: 'Lists', type: 'link' },
  //     { state: 'menu', name: 'Menu', type: 'link' },
  //     { state: 'tabs', name: 'Tabs', type: 'link' },
  //     { state: 'stepper', name: 'Stepper', type: 'link' },
  //     { state: 'ripples', name: 'Ripples', type: 'link' },
  //     { state: 'expansion', name: 'Expansion Panel', type: 'link' },
  //     { state: 'chips', name: 'Chips', type: 'link' },
  //     { state: 'toolbar', name: 'Toolbar', type: 'link' },
  //     { state: 'progress-snipper', name: 'Progress snipper', type: 'link' },
  //     { state: 'progress', name: 'Progress Bar', type: 'link' },
  //     { state: 'dialog', name: 'Dialog', type: 'link' },
  //     { state: 'tooltip', name: 'Tooltip', type: 'link' },
  //     { state: 'snackbar', name: 'Snackbar', type: 'link' },
  //     { state: 'slider', name: 'Slider', type: 'link' },
  //     { state: 'slide-toggle', name: 'Slide Toggle', type: 'link' }
  //   ]
  // }
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
