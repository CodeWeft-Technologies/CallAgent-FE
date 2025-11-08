"use client";

import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { useAuth } from "../../contexts/AuthContext";
import { Menu, X, PlayIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from 'react';
import DemoForm from "../DemoForm";

const MobileNavbar = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isDemoFormOpen, setIsDemoFormOpen] = useState(false);

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            <div className="flex lg:hidden items-center justify-end">
                <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
                
                {isOpen && (
                    <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border p-6 shadow-lg">
                        <div className="flex flex-col space-y-4">
                            <Link 
                                href="/features" 
                                onClick={handleClose}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Features
                            </Link>
                            <Link 
                                href="/pricing" 
                                onClick={handleClose}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Pricing
                            </Link>
                            {user ? (
                                <Link 
                                    href="/dashboard" 
                                    onClick={handleClose}
                                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-center"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <div className="flex flex-col space-y-2">
                                    <Link 
                                        href="/login" 
                                        onClick={handleClose}
                                        className="text-center border border-border px-4 py-2 rounded-md"
                                    >
                                        Sign In
                                    </Link>
                                    <button 
                                        onClick={() => {
                                            handleClose();
                                            setIsDemoFormOpen(true);
                                        }}
                                        className="flex items-center justify-center bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-4 py-2 rounded-md font-medium"
                                    >
                                        See Demo
                                        <PlayIcon className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <DemoForm 
                isOpen={isDemoFormOpen} 
                onClose={() => setIsDemoFormOpen(false)} 
            />
        </>
    )
};

export default MobileNavbar