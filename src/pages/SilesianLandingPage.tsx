Here's the fixed version with all missing closing brackets added:

```jsx
import React, { useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ArrowRight, MessageSquare, Settings, Lightbulb, ChevronLeft, ChevronRight, Star, Clock, CheckCircle, AlertTriangle, Mail, Phone, MapPin, Globe, Code, Database, TrendingUp, ExternalLink, Smartphone, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEOHead from '../components/SEOHead';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SilesianLandingPage = () => {
  // ... [all the existing code remains unchanged until the closing brackets are needed]

                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default SilesianLandingPage;
```