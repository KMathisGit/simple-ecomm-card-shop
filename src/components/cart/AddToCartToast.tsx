import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, X } from "lucide-react";
import { ConditionBadge } from "@/components/product/ConditionBadge";
import { Button } from "@/components/ui/button";

interface AddToCartToastProps {
  cardId: string;
  name: string;
  imageUrl: string;
  condition: string;
  quantity: number;
  price: number;
  cardSet: string;
  cardNumber: string;
  onDismiss?: () => void;
}

export function AddToCartToast({
  cardId,
  name,
  imageUrl,
  condition,
  quantity,
  price,
  cardSet,
  cardNumber,
  onDismiss,
}: AddToCartToastProps) {
  return (
    <div className="flex items-center gap-4 w-full">
      {/* Card Image */}
      <div className="w-16 h-20 relative rounded-lg overflow-hidden bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-contain"
            sizes="64px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
            Img
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 w-full grow text-black">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex flex-col">
          <h4 className="font-semibold truncate">{name}</h4>
          <h5>{`${cardSet} #${cardNumber}`}</h5>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <ConditionBadge condition={condition} />
          </div>
        </div>
        <div className="flex gap-4 text-sm font-semibold text-green-600">
            <span className="text-xs text-muted-foreground">x{quantity}</span>

        </div>
      </div>

      {/* Action Button */}
      {/* <Button asChild size="sm" variant="ghost" className="flex-shrink-0">
        <Link href={`/cards/${cardId}`}>View</Link>
      </Button> */}
    </div>
  );
}
