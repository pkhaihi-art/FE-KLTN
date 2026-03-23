/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface Artifact {
  id: string;
  styleName: string;
  html: string;
  status: 'streaming' | 'complete' | 'error';
}

export interface Session {
    id: string;
    prompt: string;
    timestamp: number;
    artifacts: Artifact[];
}

export interface ComponentVariation { name: string; html: string; }
export interface LayoutOption { name: string; css: string; previewHtml: string; }

export interface Permission {
  action: string;
  createdBy: string;
  createdDate: string;
  description: string;
  id: number;
  modifiedBy: string;
  modifiedDate: string;
  name: string;
  nameGroup: string;
  pcode: string;
  reusedId: number;
  showMenu: boolean;
  status: number;
}

export interface Group {
  description: string;
  id: number;
  kind: number;
  name: string;
  permissions: Permission[];
}

export interface Account {
  avatar: string;
  birthday: string;
  email: string;
  fullName: string;
  group: Group;
  id: number;
  isSuperAdmin: boolean;
  kind: number;
  lastLogin: string;
  phone: string;
  status: number;
  username: string;
}

export interface AdminUser extends Account {}

export interface EducatorUser {
  account: Account;
  id: number;
}

export interface StudentUser {
  account: Account;
  id: number;
}

export interface Category {
  createdDate: string;
  id: number;
  modifiedDate: string;
  name: string;
  status: number;
}

export interface ProfileAccount {
  avatar: string;
  birthday: string;
  email: string;
  fullName: string;
  phone: string;
  username: string;
}

export interface Educator {
  birthday: string;
  profileAccountDto: ProfileAccount;
}

export interface SimulationSummary {
  avgStar: number;
  duration: string;
  educator: Educator;
  id: number;
  level: number;
  notice: string;
  status: number;
  thumbnail: string;
  title: string;
  totalParticipant: number;
}

export interface SimulationDetail extends SimulationSummary {
  category: {
    id: number;
    name: string;
  };
  description: string;
  overview: string;
  videoPath: string;
}

export interface ApiResponse<T> {
  code: string;
  data: T;
  firebaseUrl: string;
  message: string;
  result: boolean;
  urlBase: string;
}

export interface PaginatedData<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}
