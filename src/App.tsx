import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import { store } from "@/app/store";
import "@/i18n";

import EntryPage from "./pages/EntryPage";
import BranchPage from "./pages/BranchPage";
import MenuPage from "./pages/MenuPage";
import ProductPage from "./pages/ProductPage";

import CheckoutPage from "./pages/CheckoutPage";
import SuccessPage from "./pages/SuccessPage";
import NotFound from "./pages/NotFound";
import InvalidLinkPage from "./pages/InvalidLinkPage";
import TermsModal from "./shared/components/TermsModal";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <TermsModal />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<InvalidLinkPage />} />
              <Route path="/session/:token" element={<EntryPage />} />
              <Route path="/:brand/session/:token" element={<EntryPage />} />
              <Route path="/branches" element={<BranchPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/product/:id" element={<ProductPage />} />

              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
