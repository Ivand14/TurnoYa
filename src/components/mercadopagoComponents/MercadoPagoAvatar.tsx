import { Avatar } from "radix-ui";

interface MercadoPagoAvatarInterface {
  picture_url: string;
  className?:string
}

import { clsx } from "clsx";

const MercadoPagoAvatar: React.FC<MercadoPagoAvatarInterface> = ({
  picture_url,
  className,
}) => (
  <div className={clsx("flex gap-5", className)}>
    <Avatar.Root className="inline-flex size-[45px] select-none items-center justify-center overflow-hidden rounded-full bg-blackA1 align-middle">
      <Avatar.Image
        className="size-full rounded-[inherit] object-cover"
        src={picture_url}
        alt="Colm Tuite"
      />
      <Avatar.Fallback
        className="leading-1 flex size-full items-center justify-center bg-white text-[15px] font-medium text-violet11"
        delayMs={600}
      >
        CT
      </Avatar.Fallback>
    </Avatar.Root>
  </div>
);

export default MercadoPagoAvatar
