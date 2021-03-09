import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { Toast } from "react-bootstrap";

interface ToastItem {
  title: string;
  content: string;
  timestamp: number;
}

type Push = (item: ToastItem) => void;
type Spread = () => JSX.Element;
type useToastType = ReturnType<typeof useToast>;

const useToast = () => {
  const [store, setStore] = useState<ToastItem[]>([]);

  const push: Push = (item) => {
    setStore((prev) => prev.concat(item));
  };

  const spread: Spread = () => {
    return (
      <>
        {!!store.length &&
          store.map((item) => {
            return <ToastComponent {...item} key={item.timestamp} />;
          })}
      </>
    );
  };

  const operation = { push, spread };
  return { operation };
};

const ToastContext = createContext<useToastType | null>({} as useToastType);

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
  const useHooks = useToast();

  return (
    <ToastContext.Provider value={useHooks}>{children}</ToastContext.Provider>
  );
};

export const useToastContext = () => useContext(ToastContext);
