import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { Toast } from "react-bootstrap";

interface ToastItem {
  title: string;
  content: string;
  timestamp: number;
}

type Push = (item: ToastItem) => void;

interface IContextProps {
  push: Push;
  spread: () => void;
}

const ToastContext = createContext<IContextProps>({} as IContextProps);

const ToastComponent = ({ title, content, timestamp }: ToastItem) => {
  const [time, setTime] = useState<number>();
  const [show, setShow] = useState(true);

  const calcTime = () => {
    const result = Math.floor((Date.now() - timestamp) / 1000 / 60);
    setTime(result);
  };

  useEffect(() => {
    calcTime();
    setTimeout(() => calcTime(), 60 * 1000);
  }, []);

  return (
    <>
      <Toast onClose={() => setShow(false)} show={show} autohide>
        <Toast.Header>
          <img className="rounded mr-2" alt="" />
          <strong className="mr-auto">{title}</strong>
          <small>{`${time} min ago`}</small>
        </Toast.Header>
        <Toast.Body>{content}</Toast.Body>
      </Toast>
    </>
  );
};

export const ToastProvider: React.FC = ({ children }) => {
  const [store, setStore] = useState<ToastItem[]>([]);

  const push: Push = (item) => {
    setStore((prev) => prev.concat(item));
  };

  const spread = () => {
    return (
      <>
        {!!store.length &&
          store.map((item) => {
            return <ToastComponent {...item} key={item.timestamp} />;
          })}
      </>
    );
  };

  return (
    <ToastContext.Provider value={{ push, spread }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => useContext(ToastContext);
