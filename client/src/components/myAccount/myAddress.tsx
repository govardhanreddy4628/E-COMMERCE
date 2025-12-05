import { useEffect, useState } from "react";
import { useToast } from "../../hooks/use-toast";
import { Button } from "../../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, X } from "lucide-react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { useForm } from "react-hook-form";
import * as z from "zod";

export interface Address {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const addressSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Pincode must be 6 digits")
});

const MyAddress = () => {
    const { toast } = useToast();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<Address>({
        resolver: zodResolver(addressSchema)
    });

    useEffect(() => {
        const savedAddresses = localStorage.getItem("savedAddresses");
        if (savedAddresses) {
            setAddresses(JSON.parse(savedAddresses));
        }
    }, []);

    const onSubmit = (data: Address) => {
        const updatedAddresses = [...addresses, data];
        setAddresses(updatedAddresses);
        localStorage.setItem("savedAddresses", JSON.stringify(updatedAddresses));
        toast({
            title: "Address Added",
            description: "Your address has been saved successfully."
        });
        reset();
        setShowAddForm(false);
    };

    const deleteAddress = (index: number) => {
        const updatedAddresses = addresses.filter((_, i) => i !== index);
        setAddresses(updatedAddresses);
        localStorage.setItem("savedAddresses", JSON.stringify(updatedAddresses));
        toast({
            title: "Address Deleted",
            description: "The address has been removed."
        });
    };
    return (
        <>
            <h1 className="text-xl font-semibold mb-4">My Address</h1>
            <hr className="my-4" />

            <div className="space-y-6">
                {addresses.length === 0 && !showAddForm && (
                    <p className="text-muted-foreground text-center py-8">
                        No saved addresses yet. Add your first address below.
                    </p>
                )}

                <div className="grid gap-4">
                    {addresses.map((addr, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                                <div>
                                    <CardTitle className="text-base">{addr.fullName}</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {addr.email} • {addr.phone}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteAddress(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">
                                    {addr.address}<br />
                                    {addr.city}, {addr.state} - {addr.pincode}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {!showAddForm ? (
                    <Button
                        onClick={() => setShowAddForm(true)}
                        className="w-full"
                        variant="outline"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Address
                    </Button>
                ) : (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle>Add New Address</CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowAddForm(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">Full Name</Label>
                                        <Input id="fullName" {...register("fullName")} />
                                        {errors.fullName && (
                                            <p className="text-sm text-destructive">{errors.fullName.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input id="phone" {...register("phone")} />
                                        {errors.phone && (
                                            <p className="text-sm text-destructive">{errors.phone.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" {...register("email")} />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">{errors.email.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" {...register("address")} />
                                    {errors.address && (
                                        <p className="text-sm text-destructive">{errors.address.message}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" {...register("city")} />
                                        {errors.city && (
                                            <p className="text-sm text-destructive">{errors.city.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="state">State</Label>
                                        <Input id="state" {...register("state")} />
                                        {errors.state && (
                                            <p className="text-sm text-destructive">{errors.state.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="pincode">Pincode</Label>
                                        <Input id="pincode" {...register("pincode")} />
                                        {errors.pincode && (
                                            <p className="text-sm text-destructive">{errors.pincode.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button type="submit" className="flex-1">
                                        Save Address
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowAddForm(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    )
};
export default MyAddress;
