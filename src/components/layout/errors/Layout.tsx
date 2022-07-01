import Link from 'next/link';
import { FC } from 'react';

export const ErrorLayout: FC<{
  title: string;
  code: number;
  message: string;
  label?: string;
  redirect?: string;
}> = ({ title, code, message, label, redirect }) => {
  return (
    <>
      <div className="min-h-full pt-16 pb-12 flex flex-col bg-white">
        <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex-shrink-0 flex justify-center">
            <Link href="/">
              <a className="inline-flex">
                <span className="sr-only">Groupomania</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="h-12 w-auto" src="/icons/icon.svg" alt="" />
              </a>
            </Link>
          </div>
          <div className="py-16">
            <div className="text-center">
              <p className="text-sm font-semibold text-scarlet-600 uppercase tracking-wide">
                erreur {code}
              </p>
              <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                {title}
              </h1>
              <p
                className="mt-2 text-base text-gray-500"
                dangerouslySetInnerHTML={{
                  __html: message.split('\\n').join('<br/>'),
                }}
              />
              <div className="mt-6">
                {label && redirect && (
                  <Link href={redirect}>
                    <a className="text-base font-medium text-scarlet-600 hover:text-scarlet-500">
                      {label}
                      <span aria-hidden="true"> &rarr;</span>
                    </a>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </main>
        {/*<footer className="flex-shrink-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">*/}
        {/*  <nav className="flex justify-center space-x-4">*/}
        {/*    <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-600">*/}
        {/*      Contact Support*/}
        {/*    </a>*/}
        {/*    <span className="inline-block border-l border-gray-300" aria-hidden="true" />*/}
        {/*    <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-600">*/}
        {/*      Status*/}
        {/*    </a>*/}
        {/*    <span className="inline-block border-l border-gray-300" aria-hidden="true" />*/}
        {/*    <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-600">*/}
        {/*      Twitter*/}
        {/*    </a>*/}
        {/*  </nav>*/}
        {/*</footer>*/}
      </div>
    </>
  );
};
