import configPromise from 'payload-config';
import { RootPage, generatePageMetadata } from '@payloadcms/next/views';

export default function PayloadAdminPage(props: any) {
  return <RootPage {...props} config={configPromise} />;
}

export const metadata = async (props: any) => {
  return generatePageMetadata({ ...props, config: configPromise } as any);
};
