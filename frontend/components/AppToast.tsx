"use client";

import React from "react";
import { toast as sonnerToast } from "sonner";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface ToastProps {
  id: string | number;
  title: string;
  type?: ToastType;
  description?: string;
  button?: {
    label: string;
    onClick: () => void;
  };
}

export type ToastType = "error" | "warning";

export function toast(toast: Omit<ToastProps, "id">) {
  const toastBtnProp = toast.button
    ? {
        label: toast.button.label,
        onClick: () => toast.button!.onClick(),
      }
    : undefined;

  return sonnerToast.custom((id) => (
    <Toast
      id={id}
      title={toast.title}
      description={toast.description}
      button={toastBtnProp}
      type={toast.type}
    />
  ));
}

const getBackGroundColor = (type?: ToastType) => {
  if (!type) return "bg-black";
  switch (type) {
    case "error":
      return "bg-red-600";
    case "warning":
      return "bg-yellow-400";
  }
};

/** A fully custom toast that still maintains the animations and interactions. */
function Toast(props: ToastProps) {
  const { title, description, button, id, type } = props;

  const backgroundColor = getBackGroundColor(type);
  return (
    <div
      className={cn(
        [backgroundColor],
        "flex rounded-lg shadow-lg w-full md:max-w-[364px] items-center p-4"
      )}
    >
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <p className="text-sm font-medium text-neutral-50">{title}</p>
          {description && (
            <p className="mt-1 text-sm text-neutral-100">{description}</p>
          )}
        </div>
      </div>
      {button && (
        <Button
          onClick={() => {
            button.onClick();
            sonnerToast.dismiss(id);
          }}
        >
          {button.label}
        </Button>
      )}
    </div>
  );
}
