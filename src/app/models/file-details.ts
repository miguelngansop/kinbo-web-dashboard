export interface File {
  absolute: boolean;
  absolutePath: string;
  canonicalPath: string;
  directory: boolean;
  file: boolean;
  freeSpace: number;
  hidden: boolean;
  name: string;
  parent: string;
  path: string;
  totalSpace: number;
  usableSpace: number;
}

export interface InputStream {
}

export interface Uri {
  absolute: boolean;
  authority: string;
  fragment: string;
  host: string;
  opaque: boolean;
  path: string;
  port: number;
  query: string;
  rawAuthority: string;
  rawFragment: string;
  rawPath: string;
  rawQuery: string;
  rawSchemeSpecificPart: string;
  rawUserInfo: string;
  scheme: string;
  schemeSpecificPart: string;
  userInfo: string;
}

export interface Content {
}

export interface Url {
  authority: string;
  content: Content;
  defaultPort: number;
  file: string;
  host: string;
  path: string;
  port: number;
  protocol: string;
  query: string;
  ref: string;
  userInfo: string;
}

export interface FileDetails {
  description: string;
  file: File;
  filename: string;
  inputStream: InputStream;
  open: boolean;
  readable: boolean;
  uri: Uri;
  url: Url;
}
